16/11/25

Developed the CartPopup.tsx component to display the cart product using state context based on the showcart state adding a scrollable item list, dynamic qty display and total price calculations that get dynamically updated.For styling I made it afixed position layout with an overlay and close functionality using AioutlineClose icon. Added Tailwind CSS styling with a similar layout to the rest of the website 

13/11/25

Completed the cart stateContext logic and manages cartItems, totalPrice, totalQty, and individual product qty. Implemented core business logic functions incQty and decQty making sure it doesn't go bellow 1. The onAdd function is used to either add a new product to the cart displaying name,image and qty or just updating qty if product already exists in cart(making it more efficient for user).

09/11/25

Extended the Navbar to include a stateful cart icon dynamically displaying totalqty used animations and css found online to position the qty counter.Used the onclick handler for icon toggles the show cart boolean contolling visability of cartPop up component.

07/11/25

Initiated the structure for the application state management by creating a StateContext file.Defined a Typescript interface cartContext for type safety for variables.Context provider component wrap the application root, making cart state accessible to any child. This allowed me to make my cart logically accessible from any page.

02/11/25

Researched payment gateway integration and authentication service issues.Investigated Stripe’s API documentation for next.js integration focusing on checkout and webhook handling for secure payment processing. Also encountered persistent issues when trying to implement the clerk authentication service configuration was conflicting with static asset delivery and causing unexpected redirects. So I made the decision to prioritise core e-commerce functionality then try and set up clerk once again.

30/10/25

I reasearched state managemnet architecture using react context API looked into youtube tutorial where a dynamic cart was implemented and noted down tannedhe functions neededand some checks I didnt think of. I specifically also looked at react documents for this explaining its suitability against prop-drilling to get a better understanding of why its used. Planned state variables along with functions I will use in state context files.

26/10/25

I added the NavBar to the main landing page and styled the product slots under bestseller using Tailwind CSS classes.I also tested this out by accessing Sanity Studio and adding products to see if they are added correctly.

23/10/25

Added a landing page for the website, implementing a carousel design using Tailwind CSS classes to help and added placement image holders. I will then replace this with sales that are going on or actual product sections.

19/10/25

Established project foundation with Next.js app and styling used app routed to start of core application structure, then implemented the main Navbar component. Also addresses a critical build error by correctly configuring the next.config.ts file to handle the external images domain and Sanity's image CDN. Applied initial global styles  and CSS modules, focusing on a cohesive design to match my design idea.


12/10/25 - 

I created the first schemas for product and category  for basic defining fields such as product name,description,image and category reference. I also watched some tutorials on how to use and set up Clerk for authentication.I also looked up functions needed for making a dynamic cart that updates quantities and adds products.



11/10/25 - Setting up the environment and Sanity research

This week I set up the Next.js environment locally and configured Tailwind CSS installing all dependencies and testing out the server to ensure it runs correctly. I then moved on to setting up Sanity I initially encountered some difficulties since I was following an outdated tutorial .After reading the official documentation again and a recent guide was able to set it up successfully launched and accessed the /studio. During this process I learnt more about the schema definitions structure product data and started planning fields necessary for my website.



03/10/25 - Refining project idea and working on term1 plan

I refined my project idea to focus on the skincare industry as it represents a rapidly growing e-commerce sector where AI integration can assist and create a personalsied experiece for the user. I researched existing skincare websites to identify features I liked from both the user design and useful features related to personalisation and user interactions. I also worked on my term 1 development outlining weekly milestones and main objectives. While researching potential tools and services I decided to use Next.js for the frontend with Node.js for the backend. I also found a service called Sanity CMS for managing the product data,Stripe for secure payments and Clerk for authetication. Since Clerk and Sanity are new to me, I read up on the official documentation and how to set them up.



29/09/25 - Project brainstorming and configuring GitLab repository:

I began this week with brainstorming potential ideas for my Advanced Web Development project and after reviewing the moodle guidelines and examples, I decided on creating an e-commerce website incorporating advanced features such as personalised product recommendations,smart search and an AI-powered chatbot assistant. I also researched different technologies that would make it simple to implement these features. I sketched out the initial system concept to present to my supervisor for our meeting. I also set up the GitLab repository by making a new personal access token and successfully cloning the repository to my local environment.









