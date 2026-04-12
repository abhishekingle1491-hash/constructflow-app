<h2>About</h2>
<p>This is a modern, cloud-native, all-in-one Software-as-a-Service (SaaS) platform template, built using Laravel, react.js, tailwindcss, mysql. </p>
<p>Project follows a "stateless, API-driven backend service". This architectural choice is common in modern web development, promoting scalability and a clean separation of concerns between the frontend and backend. A developer's initial impulse when hearing "stateless API" is often to reach for token-based authentication, such as JSON Web Tokens (JWTs), stored on the client-side in browser storage mechanisms like localStorage.
However, for a first-party SPA—where the frontend application and the backend API are developed and controlled by the same entity—the industry-standard and most secure approach is to leverage a stateful, cookie-based session mechanism. This is not a contradiction of the "stateless" principle but a nuanced and deliberate security posture.</p>
<p>The application's business logic remains stateless; each API request from the frontend contains all the information needed for the backend to process it, without relying on the memory of previous requests. The authentication layer, however, is intentionally made stateful, managed by Laravel Sanctum's robust, built-in session handling services. This design provides superior security compared to storing bearer tokens in client-side browser storage.
The decision to adopt a stateful authentication layer for a stateless application architecture resolves a common point of confusion by prioritizing security. While localStorage is accessible to any JavaScript running on the page, server-set cookies can be protected from such access, neutralizing a significant attack vector. This guide proceeds with the understanding that accepting statefulness at the authentication layer is a necessary trade-off to achieve a higher level of security for the overall application.
</p>

<h3>Login & Register</h3>

<img width="1898" height="958" alt="image" src="https://github.com/user-attachments/assets/1295c48e-3cf5-4919-8da8-d6b8d6724d6f" />

<h3>Dashboard</h3>

<img width="1896" height="943" alt="image" src="https://github.com/user-attachments/assets/eff6e9a3-dd43-43d8-9e97-f68dbd6400b4" />

<h3>User Profile</h3>

<img width="1887" height="943" alt="image" src="https://github.com/user-attachments/assets/f52acd91-c018-4fe4-9888-30e63dec6313" />

<h3>Pop-up</h3>

<img width="1697" height="977" alt="image" src="https://github.com/user-attachments/assets/a69b0102-228a-4e90-9dfc-f729c105de80" />

