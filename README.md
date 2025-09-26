Mini Commerce Demo

Hi there! This is a simple Node.js and Express app built for a technical assessment. It's a mini e-commerce site with two roles: an Admin who can add products and see orders, and a Client who can browse products and place an order.

Getting Started Locally
You'll need:
Node.js (v14 or later) and npm

Steps:
Download and unzip the project.

Open your terminal in the project folder.

Run npm install to get the dependencies (Express, EJS).

Run npm start to launch the server.

Open your browser and head to:

Client Page: http://localhost:3000

Admin Page: http://localhost:3000/admin?role=admin

Taking This to Production on AWS
This app is simple now, but here’s how I'd build it for the real world using a modern, serverless AWS setup. This approach is scalable, secure, and cost-effective.

1. Backend: API Gateway & Lambda
Instead of a single Express server, I'd split each API endpoint into its own AWS Lambda function. Amazon API Gateway would then act as the front door, routing requests like GET /products to the right function. This way, we only pay for code that's actually running, and it scales automatically.

2. Database: DynamoDB
The in-memory arrays would be replaced with Amazon DynamoDB, a super-fast NoSQL database. I'd have a Products table and an Orders table. It’s fully managed and can handle any amount of traffic without breaking a sweat.

3. Frontend: S3 & CloudFront
I would build the frontend as a static site (using a library like React or just plain HTML/CSS) and host the files on Amazon S3. To make it load quickly for users anywhere, I'd put Amazon CloudFront (a CDN) in front of it. CloudFront caches the site at locations around the globe and also handles setting up HTTPS.

4. Users & Security: Amazon Cognito
For handling user sign-up, login, and managing roles (Admin vs. Client), I'd use Amazon Cognito. It securely manages user accounts and provides tokens (JWTs) after a successful login. The frontend would send this token with every API request, and API Gateway would verify it to ensure the user has the correct permissions for that action.

5. Adding Payments with PayPal
To process payments securely, the flow must be server-driven:
The client clicks "Pay," and the frontend calls our backend (a Lambda function).
This Lambda function securely communicates with the PayPal API to create a payment intent.
The user approves the transaction in the PayPal popup on the frontend.
Another Lambda function gets the final confirmation from PayPal and updates the order's status to PAID in DynamoDB. This server-side validation is critical for security.

6. Scaling & SEO
Scaling: This serverless architecture scales automatically by design. Lambda, DynamoDB, and API Gateway handle traffic spikes without any manual intervention.

SEO: For a production app, I'd use a framework like Next.js to enable Server-Side Rendering (SSR). This serves fully-rendered HTML pages on the initial load, which is much better for search engine crawlers and perceived performance.
