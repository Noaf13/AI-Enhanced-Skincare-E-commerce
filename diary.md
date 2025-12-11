



29/11/25 -

Successfully implemented Clerk authentication across the application. Configured the middleware.ts file and updated layout.tsx to include ClerkProivder for global authentication context and redesigned the navbar to feature dynamic authentication components with modal-based Sign In and Sign up.



Clerk issue(For reference, if issues with npm install arise again):

The authentication was supposed to be added as one of the first major integrations in the website but was pushed back for many weeks since the initial setup was blocked by persistent OneDrive synchronisation issues that prevented npm install of clerk packages. Repeated attempts would fail due to file permission errors and storage conflicts that I was aware effected. I fixed the storage issue and ran the installation command with administrative privileges. Clerk was finally installed with this specific command fixing dependency issues too.

image.png



23/11/25

I decided to tackle some issues with the cart popup to function as a proper modal overlay, allowing users to interact with the rest of the page however I encountered some design challenges with layout stretching during implementation. Fixed navigation logic so when the navbar logo is pressed it takes you to the homepage and exits out of the popup. I also decided to add the “Add to cart” buttons to all the product cards on the home page.

16/11/25

Developed the CartPopup.tsx component to display the cart product using state context based on the showcart state adding a scrollable item list, dynamic qty display and total price calculations that get dynamically updated.For styling I made it afixed position layout with an overlay and close functionality using AioutlineClose icon. Added Tailwind CSS styling with a similar layout to the rest of the website 



13/11/25

Completed the cart stateContext logic and manages cartItems, totalPrice, totalQty, and individual product qty. Implemented core business logic functions incQty and decQty making sure it doesn't go bellow 1. The onAdd function is used to either add a new product to the cart displaying name,image and qty or just updating qty if product already exists in cart(making it more efficient for user).



09/11/25

Extended the Navbar to include a stateful cart icon dynamically displaying totalqty used animations and css found online to position the qty counter.Used the onclick handler for icon toggles the show cart boolean contolling visability of cartPop up component.

07/11/25

Initiated the structure for the application state management by creating a StateContext file.Defined a Typescript interface cartContext for type safety for variables.Context provider component wrap the application root, making cart state accessible to any child. This allowed me to make my cart logically accessible from any page.



02/11/25

Researched payment gateway integration and authentication service issues.Investigated Stripe’s API documentation for next.js integration focusing on checkout and webhook handling for secure payment processing. Also encountered persistent issues when trying to implement the clerk authentication service configuration was conflicting with static asset delivery and causing unexpected redirects. So I made the decision to prioritise core e-commerce functionality, then try and set up clerk once again.



30/10/25

I reasearched state managemnet architecture using react context API looked into youtube tutorial where a dynamic cart was implemented and noted down the functions needed and some checks I didnt think of. I specifically also looked at react documents for this explaining its suitability against prop-drilling to get a better understanding of why its used. Planned state variables along with functions I will use in state context files.  

https://nextjs.org/docs/app/getting-started/server-and-client-components



28/10/25

I successfully created dynamic product pages using slug saved in sanity /products/[slug] but i initially encpuntered buffereing when I retreived the sanity data it would load blank first before displaying content. To solve this  implemented data fetching with React.useEffect and the "use client" allowing page to render immediately while product data (name, price, description, image) loads asynchronously. I used a TypeScript interface to ensure type safety. The UI feature includes a product card with (name,price,description and image) that loads in a column with buy now,add to cart and quantity button.



26/10/25:

I focused on implementing the product listing under the best sellers in the home page. Using Tailwind CSS, I built a responsive grid layout that adapts from a single column on mobile to four columns on desktop displays. Added and styled the product card to show just the name of the product and price. I integrated the frontend with Sanity CMS by implementing a TypeScript interface for product data and creating a GROQ query to fetch available products and then I tested this new integration by adding more products on Sanity and verified that they automatically update.

https://www.sanity.io/docs/content-lake/how-queries-work

https://www.sanity.io/docs/apis-and-sdks/image-urls#image-urls-in-queries



23/10/25

I implemented the landing page components consisting of the Navbar and herobanner.I added a responsive navbar that I have styled previously in another project so I transferred the CSS and changed the logo and colours.I also implemented the HeroBanner section using Tailwind CSS to create a dynamic carousel with placeholder website images.The styling of the shopping cart icon initially gave me a lot of trouble since I used an image and it didn't align correctly and I wasn’t able to syle it, so I opted for an icon from react-icons/ai using the styling from a youtube video .



19/10/25

Established project foundation with Next.js app and styling used app routed to start of core application structure, then implemented the main Navbar component. Also addressed a critical build error by correctly configuring the next.config.ts file to handle the external images domain and Sanity's image CDN. Applied initial global styles  and CSS modules, focusing on a cohesive design to match my design idea.



12/10/25 - 

I created the first schemas for product and category  for basic defining fields such as product name,description,image and category reference. I also watched some tutorials on how to use and set up Clerk for authentication.I also looked up functions needed for making a dynamic cart that updates quantities and adds products.



11/10/25 - Setting up the environment and Sanity research

This week I set up the Next.js environment locally and configured Tailwind CSS installing all dependencies and testing out the server to ensure it runs correctly. I then moved on to setting up Sanity I initially encountered some difficulties since I was following an outdated tutorial .After reading the official documentation again and a recent guide was able to set it up successfully launched and accessed the /studio. During this process I learnt more about the schema definitions structure product data and started planning fields necessary for my website.



03/10/25 - Refining project idea and working on term1 plan

I refined my project idea to focus on the skincare industry as it represents a rapidly growing e-commerce sector where AI integration can assist and create a personalsied experiece for the user. I researched existing skincare websites to identify features I liked from both the user design and useful features related to personalisation and user interactions. I also worked on my term 1 development outlining weekly milestones and main objectives. While researching potential tools and services I decided to use Next.js for the frontend with Node.js for the backend. I also found a service called Sanity CMS for managing the product data,Stripe for secure payments and Clerk for authetication. Since Clerk and Sanity are new to me, I read up on the official documentation and how to set them up.



29/09/25 - Project brainstorming and configuring GitLab repository:

I began this week with brainstorming potential ideas for my Advanced Web Development project and after reviewing the moodle guidelines and examples, I decided on creating an e-commerce website incorporating advanced features such as personalised product recommendations,smart search and an AI-powered chatbot assistant. I also researched different technologies that would make it simple to implement these features. I sketched out the initial system concept to present to my supervisor for our meeting. I also set up the GitLab repository by making a new personal access token and successfully cloning the repository to my local environment.









