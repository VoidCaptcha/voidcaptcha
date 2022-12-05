How does VoidCaptcha work?
==========================
The full process of **VoidCaptcha** is done n 3 simple steps:

1. **Create** - A random user-based session key is generated and passed to the JavaScript library on 
the website. This is used to identify the current request and user, together with the puzzle and 
puzzle solution as described in the upcoming steps.

2. **Request** - The JavaScript front-end requests a randomly generated puzzle using the available 
active providers, submitted together with the previously generated session key. The back-end 
stores a checksum for the solution of the puzzle, linked to the respective session key.

3. **Validate** - The result of the puzzle, as done by the visitor, is stored as checksum and 
submitted to the form request. When both checksums match, the request is valid.


1. Create a session-key
-----------------------
Each request receives a unique generated key, based on some random bytes, and does NOT rely on any 
user specific details (such as the IP address, user agent or similar data). This key should be 
stored in the current user session
