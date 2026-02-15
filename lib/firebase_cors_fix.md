# Fixing Firebase Storage CORS Errors

The error `net::ERR_FAILED` or `blocked by CORS policy` happens because Firebase Storage needs to be told that your local app (localhost:3000) is allowed to upload files.

Follow these steps to fix it:

### Step 1: Open Google Cloud Shell
1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Select your project: `pickle-business-b1b0e`.
3. Click the **Activate Cloud Shell** button (the `>_` icon in the top right header).

### Step 2: Create a robust CORS configuration file
In the Cloud Shell terminal, run this command (it includes extra headers needed for uploads):

```bash
echo '[{"origin": ["*"], "method": ["GET", "POST", "PUT", "DELETE", "HEAD"], "responseHeader": ["Content-Type", "x-goog-resumable"], "maxAgeSeconds": 3600}]' > cors.json
```

### Step 3: Apply and VERIFY the configuration
Run this command. **Please tell me exactly what it prints out:**

```bash
gsutil cors set cors.json gs://pickle-business-b1b0e.firebasestorage.app
```

### Step 4: Double check propagation
Sometimes it takes 1-2 minutes to take effect. If it STILL fails after you see a "Setting CORS on..." message:
1. Try a different browser or Hard Refresh (Ctrl + F5).
2. Check if the bucket name is `gs://pickle-business-b1b0e.appspot.com` instead (try running the command for that name as well just in case).

---

### Why this is needed?
By default, web browsers block scripts from one domain (localhost) from making requests to another domain (googleapis.com) unless the server explicitly allows it. These steps tell the Firebase Storage server that it's safe to accept uploads from your development environment.

Once you run these commands, try uploading your pickle again in the Admin App!
