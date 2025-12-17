11/12/25

I implemented the async onAdd function and successfully optimised the main basket functionality in sateContext.tsx by adding a snapshot for rollback functionality and implemented loading states to the buttons. The basket now is instant and maintains data integrity if networks fails(rollback). During the implementation, I also realised that I have 2 different AddToCart button components, one for product detail pages and another one for main listing, which means I will need to refactor them into one single reusable component in the future.



Testing the rollout:

image.png



09/12/25

I was looking for ways to optimise and refactor my cart function to improve user experience. I researched and learned about rollout and optimistic UI pattern, where the interface updates immediately while server operations happen in the background. I incorporated cart updates with a loading state to eliminate the previous delay when adding to the cart and added visual feedback.

The cart flow before was:
User click→app freezes(user waiting, no visual feedback)→UI updates(cart number jumps in icon)→success toast notif

cart flow after UI optimisation pattern:
user click→Instant feedback: 1.button says adding... 2.cart items and number add immediately →[success - toast notif]

[Error]→Items disappear to the last snapshot and failed notif.



29/11/25 

Successfully implemented Clerk authentication across the application. Configured the middleware.ts file and updated layout.tsx to include ClerkProvider for global authentication context. Redesigned the navbar to feature dynamic authentication components with modal-based Sign In and Sign up.



Clerk issue(For reference, if issues with npm install arise again):

The authentication was supposed to be added as one of the first major integrations on the website, but was pushed back for many weeks since the initial setup was blocked by persistent OneDrive synchronisation issues that prevented npm install of Clerk packages. Repeated attempts would fail due to file permission errors and storage conflicts that I was aware effected. I fixed the storage issue and ran the installation command with administrative privileges. Clerk was finally installed with this specific command, which also fixed dependency issues.

image.png



23/11/25

I decided to tackle some issues with the cart popup to function as a proper modal overlay, allowing users to interact with the rest of the page. However, I encountered some design challenges with layout stretching during implementation. Fixed navigation logic so when the navbar logo is pressed, it takes you to the homepage and exits out of the popup. I also decided to add the “Add to cart” buttons to all the product cards on the home page.



19/11/25

I implemented Stripe payments into my application and linked it to the “Checkout” and “Buy Now” buttons. The setup was quite straightforward and the documentation was very clear with the configurations. However, setting up the checkout API route took some time. I had to ensure the cart items from the frontend were correctly formatted for Stripe's session creation. I also added support for multiple shipping options (Standard and Express ).

The frontend checkout button now triggers the Stripe payment flow with proper loading and error states. I mainly focused on handling errors so users receive clear feedback.I also created a success page to confirm the order, which still needs some styling.





16/11/25

Developed the CartPopup.tsx component to display the cart product using state context based on the showcart state. Added a scrollable item list, dynamic quantity display and total price calculations that get dynamically updated. For styling, I made it a fixed position layout with an overlay and close functionality using AioutlineClose icon. Added Tailwind CSS styling with a layout similar to the rest of the website.



13/11/25

Completed the cart stateContext logic which manages cartItems, totalPrice, totalQty, and individual product quantities. Implemented core business logic functions incQty and decQty, making sure it doesn't go bellow 1. The onAdd function is used to either add a new product to the cart (displaying name,image and quantity) or just update the quantity if the product already exists in the cart(making it more efficient for the user).



09/11/25

Extended the Navbar to include a stateful cart icon, dynamically displaying total quantity. Used animations and CSS found online to position the quantity counter. Used the onclick handler for the icon to toggle the showCart boolean contolling visability of the CartPopup component.



07/11/25

Initiated the structure for the application state management by creating a StateContext file.Defined a Typescript interface cartContext for type safety for variables. The Context provider component wraps the application root, making cart state accessible to any child. This allowed me to make my cart logically accessible from any page.



02/11/25

Researched payment gateway integration and authentication service issues.Investigated Stripe’s API documentation for next.js integration, focusing on checkout and webhook handling for secure payment processing. Also encountered persistent issues when trying to implement the clerk authentication service, configuration was conflicting with static asset delivery and causing unexpected redirects. So I made the decision to prioritise core e-commerce functionality, then try and set up Clerk once again.



30/10/25

I researched state management architecture using React Context API, looked into a dynamic cart implementation and noted down the functions needed and some checks I hadn’t considered. I specifically also looked at react documents for this, explaining its suitability against prop-drilling to get a better understanding of why it’s used. Planned state variables along with functions I will use in state context files.  

https://nextjs.org/docs/app/getting-started/server-and-client-components



28/10/25

I successfully created dynamic product pages using slug saved in Sanity: /products/[slug]. However, I initially encountered buffering when I retrieved the Sanity data it would load blank first before displaying content. To solve this, I implemented data fetching with React.useEffect and the "use client" allowing the page to render immediately while product data (name, price, description, image) loads asynchronously. I used a TypeScript interface to ensure type safety. The UI feature includes a product card with (name,price,description and image) that loads in a column with buy now,add to cart and quantity buttons.



26/10/25:

 I focused on implementing the product listing under “Best Sellers” on the home page. Using Tailwind CSS  I built a responsive grid layout and added and styled the product card to show the name of the product and price. I integrated the frontend with Sanity CMS by implementing a TypeScript interface for product data and creating a GROQ query to fetch available products. I then tested this new integration by adding more products in Sanity and verified that they automatically updated.

https://www.sanity.io/docs/content-lake/how-queries-work

https://www.sanity.io/docs/apis-and-sdks/image-urls#image-urls-in-queries



23/10/25

I implemented the landing page components consisting of the Navbar and herobanner. I added a responsive navbar that I have styled previously in another project, so I transferred the CSS and changed the logo and colours. I also implemented the HeroBanner section using Tailwind CSS to create a dynamic carousel with placeholder website images. The styling of the shopping cart icon initially gave me a lot of trouble since I used an image and it didn't align correctly and I wasn’t able to syle it, so I opted for an icon from react-icons/ai.



19/10/25

Established project foundation with Next.js app and styling used app routed to start of core application structure, then implemented the main Navbar component. Also addressed a critical build error by correctly configuring the next.config.ts file to handle the external images domain and Sanity's image CDN. Applied initial global styles  and CSS modules, focusing on a cohesive design to match my design idea.



12/10/25 - 

I created the first schemas for product and category  for basic defining fields such as product name,description,image and category reference. I also watched some tutorials on how to use and set up Clerk for authentication.I also looked up functions needed for making a dynamic cart that updates quantities and adds products.



11/10/25 - Setting up the environment and Sanity research

This week I set up the Next.js environment locally and configured Tailwind CSS, installing all dependencies and testing out the server to ensure it runs correctly. I then moved on to setting up Sanity. I initially encountered some difficulties since I was following an outdated tutorial. After reading the official documentation again, and a recent guide I was able to set it up successfully. I  launched and accessed the /studio. During this process, I learnt more about the schema definitions, structured product data and started planning the fields necessary for my website.



03/10/25 - Refining project idea and working on Term1  plan

I refined my project idea to focus on the skincare industry as it represents a rapidly growing e-commerce sector where AI integration can assist and create a personalised experience for the user. I researched existing skincare websites to identify features I liked from both the user design and useful features related to personalisation and user interactions. 

I also worked on my Term 1 development plan outlining weekly milestones and main objectives I had. While researching potential tools and services, I decided to use Next.js for the frontend with Node.js for the backend. I also found a service called Sanity CMS for managing product data, Stripe for secure payments and Clerk for authentication. Since Clerk and Sanity are new to me, I read up on the official documentation and how to set them up.



29/09/25 - Project brainstorming and configuring GitLab repository:

I began this week with brainstorming potential ideas for my Advanced Web Development project and after reviewing the Moodle guidelines and examples, I decided on creating an e-commerce website incorporating advanced features such as personalised product recommendations,smart search and an AI-powered chatbot assistant. I also researched different technologies that would make it simple to implement these features. I sketched out the initial system concept to present to my supervisor for our meeting. I also set up the GitLab repository by making a new personal access token and successfully cloning the repository to my local environment.









