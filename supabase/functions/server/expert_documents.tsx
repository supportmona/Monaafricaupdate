import { Hono } from "npm:hono";
import { createClient } from "npm:@supabase/supabase-js@2";

const app = new Hono();

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

// Upload document
app.post("/upload", async (c) => {
  try {
    const expertToken = c.req.header("X-Expert-Token");
    if (!expertToken) {
      return c.json({ success: false, error: "Token expert manquant" }, 401);
    }

    const { data: expertData } = await supabase.auth.getUser(expertToken);
    if (!expertData?.user?.id) {
      return c.json({ success: false, error: "Expert non authentifié" }, 401);
    }
    const expertId = expertData.user.id;

    const formData = await c.req.formData();
    const file = formData.get("file") as File;
    const patientId = formData.get("patientId") as string;
    const documentType = formData.get("documentType") as string;
    const notes = formData.get("notes") as string;

    if (!file) {
      return c.json({ success: false, error: "Fichier manquant" }, 400);
    }

    // Upload to Supabase Storage
    const bucketName = "make-6378cc81-documents";
    
    // Check if bucket exists, create if not
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some(bucket => bucket.name === bucketName);
    
    if (!bucketExists) {
      await supabase.storage.createBucket(bucketName, { public: false });
    }

    const fileExt = file.name.split(".").pop();
    const fileName = `${expertId}/${Date.now()}-${crypto.randomUUID()}.${fileExt}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(fileName, file, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      return c.json({ success: false, error: "Erreur upload fichier" }, 500);
    }

    // Store metadata in KV Store
    const documentId = crypto.randomUUID();
    const documentMetadata = {
      id: documentId,
      expertId,
      patientId: patientId || null,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      storagePath: fileName,
      documentType: documentType || "other",
      notes: notes || "",
      uploadedAt: new Date().toISOString(),
    };

    const key = `expert_document:${documentId}`;
    await supabase.from("kv_store_6378cc81").insert({
      key,
      value: documentMetadata,
    });

    // Also index by expert
    const expertDocsKey = `expert_documents:${expertId}`;
    const { data: existingDocs } = await supabase
      .from("kv_store_6378cc81")
      .select("value")
      .eq("key", expertDocsKey)
      .single();

    const docsList = existingDocs?.value || [];
    docsList.push(documentId);

    await supabase.from("kv_store_6378cc81").upsert({
      key: expertDocsKey,
      value: docsList,
    });

    return c.json({
      success: true,
      data: documentMetadata,
    });
  } catch (error) {
    console.error("Erreur upload document expert:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Get expert documents
app.get("/list", async (c) => {
  try {
    const expertToken = c.req.header("X-Expert-Token");
    if (!expertToken) {
      return c.json({ success: false, error: "Token expert manquant" }, 401);
    }

    const { data: expertData } = await supabase.auth.getUser(expertToken);
    if (!expertData?.user?.id) {
      return c.json({ success: false, error: "Expert non authentifié" }, 401);
    }
    const expertId = expertData.user.id;

    const expertDocsKey = `expert_documents:${expertId}`;
    const { data: docsList } = await supabase
      .from("kv_store_6378cc81")
      .select("value")
      .eq("key", expertDocsKey)
      .single();

    const documentIds = docsList?.value || [];
    
    if (documentIds.length === 0) {
      return c.json({ success: true, data: [] });
    }

    // Get all documents
    const keys = documentIds.map((id: string) => `expert_document:${id}`);
    const { data: documents } = await supabase
      .from("kv_store_6378cc81")
      .select("value")
      .in("key", keys);

    const docs = documents?.map((d) => d.value) || [];

    return c.json({
      success: true,
      data: docs,
    });
  } catch (error) {
    console.error("Erreur récupération documents expert:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Download document (get signed URL)
app.get("/:documentId/download", async (c) => {
  try {
    const expertToken = c.req.header("X-Expert-Token");
    if (!expertToken) {
      return c.json({ success: false, error: "Token expert manquant" }, 401);
    }

    const { data: expertData } = await supabase.auth.getUser(expertToken);
    if (!expertData?.user?.id) {
      return c.json({ success: false, error: "Expert non authentifié" }, 401);
    }
    const expertId = expertData.user.id;

    const documentId = c.req.param("documentId");
    const key = `expert_document:${documentId}`;

    const { data: docData } = await supabase
      .from("kv_store_6378cc81")
      .select("value")
      .eq("key", key)
      .single();

    if (!docData?.value) {
      return c.json({ success: false, error: "Document non trouvé" }, 404);
    }

    const document = docData.value;

    // Verify ownership
    if (document.expertId !== expertId) {
      return c.json({ success: false, error: "Accès non autorisé" }, 403);
    }

    // Generate signed URL
    const bucketName = "make-6378cc81-documents";
    const { data: signedUrlData, error: signedError } = await supabase.storage
      .from(bucketName)
      .createSignedUrl(document.storagePath, 3600); // 1 hour

    if (signedError) {
      console.error("Signed URL error:", signedError);
      return c.json({ success: false, error: "Erreur génération URL" }, 500);
    }

    return c.json({
      success: true,
      data: {
        url: signedUrlData.signedUrl,
        document,
      },
    });
  } catch (error) {
    console.error("Erreur download document:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Delete document
app.delete("/:documentId", async (c) => {
  try {
    const expertToken = c.req.header("X-Expert-Token");
    if (!expertToken) {
      return c.json({ success: false, error: "Token expert manquant" }, 401);
    }

    const { data: expertData } = await supabase.auth.getUser(expertToken);
    if (!expertData?.user?.id) {
      return c.json({ success: false, error: "Expert non authentifié" }, 401);
    }
    const expertId = expertData.user.id;

    const documentId = c.req.param("documentId");
    const key = `expert_document:${documentId}`;

    const { data: docData } = await supabase
      .from("kv_store_6378cc81")
      .select("value")
      .eq("key", key)
      .single();

    if (!docData?.value) {
      return c.json({ success: false, error: "Document non trouvé" }, 404);
    }

    const document = docData.value;

    // Verify ownership
    if (document.expertId !== expertId) {
      return c.json({ success: false, error: "Accès non autorisé" }, 403);
    }

    // Delete from storage
    const bucketName = "make-6378cc81-documents";
    await supabase.storage.from(bucketName).remove([document.storagePath]);

    // Delete metadata
    await supabase.from("kv_store_6378cc81").delete().eq("key", key);

    // Remove from expert's list
    const expertDocsKey = `expert_documents:${expertId}`;
    const { data: existingDocs } = await supabase
      .from("kv_store_6378cc81")
      .select("value")
      .eq("key", expertDocsKey)
      .single();

    if (existingDocs?.value) {
      const updatedList = existingDocs.value.filter((id: string) => id !== documentId);
      await supabase.from("kv_store_6378cc81").upsert({
        key: expertDocsKey,
        value: updatedList,
      });
    }

    return c.json({ success: true });
  } catch (error) {
    console.error("Erreur suppression document:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

export default app;
