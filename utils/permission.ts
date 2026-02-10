export const checkAndRequestPermissions = async (
    types: ('camera' | 'microphone')[],
    force: boolean = false
): Promise<boolean> => {
    const needsCamera = types.includes('camera');
    const needsMic = types.includes('microphone');

    if (force) {
        localStorage.removeItem('permission_camera_granted');
        localStorage.removeItem('permission_microphone_granted');
    }

    const cameraGranted = localStorage.getItem('permission_camera_granted') === 'true';
    const micGranted = localStorage.getItem('permission_microphone_granted') === 'true';

    // If we already have the requested permissions marked as granted in storage, return true.
    // Note: We trust storage to avoid re-prompting, but the browser might still prompt if user revoked at OS level.
    // However, the user specifically asked "don't ask again on same device", which implies skipping our own logic checks
    // or assuming the browser remembers (which it usually does if https). 
    // But standard getUserMedia ALWAYS returns a promise. 
    // If we want to strictly follow "ask once", implies we assume it's good if we stored it.
    // But we still need to actually GET the stream to use it. 
    // So this utility might be more about "checking if we should show a custom pre-prompt" or just calling getUserMedia.
    // Actually, standard behaviour is: browser remembers decision for HTTPS sites.
    // If the user means "don't show MY APP'S custom permission modal", that's one thing.
    // If they mean "trigger browser prompt", browser handles that.
    // Let's assume the user wants us to *trigger* the request proactively and maybe use localStorage to avoiding logic that *conditionally* requests it?
    //
    // Actually, the request "申请相机和麦克风的权限，之后在同一个设备上就不需要再询问" matches standard Browser behavior on HTTPS.
    // But maybe they want to request *Both* at once upfront?
    // Let's try to request the streams. If localStorage says we have them, we just proceed.

    if (!force && (!needsCamera || cameraGranted) && (!needsMic || micGranted)) {
        return true;
    }

    // Check if MediaDevices API exists (it is undefined in insecure contexts like HTTP on mobile)
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.error("MediaDevices API not available. Likely insecure context (HTTP).");
        return false;
    }

    try {
        const constraints: MediaStreamConstraints = {
            video: needsCamera,
            audio: needsMic
        };

        // If forcing, we might want to catch specific errors to guide user
        const stream = await navigator.mediaDevices.getUserMedia(constraints);

        // Stop tracks immediately as we just wanted to trigger the permission prompt
        stream.getTracks().forEach(track => track.stop());

        if (needsCamera) localStorage.setItem('permission_camera_granted', 'true');
        if (needsMic) localStorage.setItem('permission_microphone_granted', 'true');

        return true;
    } catch (err) {
        console.error("Permission request failed", err);
        // If failed, make sure we clear the flags so we try again next time
        if (needsCamera) localStorage.removeItem('permission_camera_granted');
        if (needsMic) localStorage.removeItem('permission_microphone_granted');
        return false;
    }
};
