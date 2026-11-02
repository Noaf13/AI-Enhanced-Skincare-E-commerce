05/04/26

Started Building Phase 2 of the AI chatbot by replacing keyword matching with Groq LLM API.I evaluated different providers at first and ruled out my initial plan of using the Hugging Face API because of the free tier's 20–40 second cold-start delays, and ended up choosing GROQ LLama 4 scout.

I created /api/chat/route.ts as a server-side API route with a POST handler that runs a pipeline for safetyCheck(), fetches Sanity products, then calls Groq () with the product context injected into the system message. My biggest priority was the safety of the user, so I implemented a 2-layer safety system with a system prompt to ensure only skincare messages are answered and medical advice is not given and this was secured using safetyCheck() which blocked some medical terms/words.

Reflecting on my 2-phase chatbot plan I realised it was very successful and made implementing AI a lot easier and safer with a fallback mechanism.

01/04/26

Completed phase 1 UI components fully with  ChatButton, ChatContainer, ChatMessage, ChatInput and ProductResponse.Used a typing animation to make the chatbot more user-friendly. One UX issue was the bot reply appearing so fast it felt robotic, so I added a 500ms artificial delay in responseservice.ts to make the typing indicator actually visible.

I also had a layout issue where quick reply buttons were wrapping and pushing message bubbles upward in the scroll container. Fixed this by constraining the message area to a fixed height with overflow-y-auto so the button area never compresses the message history. 

29/03/26

Successfully built the core basic chatbot logic by creating type.ts with the message, ChatState and Product interfaces, then built keywordmatch.ts with matchKeywords() and getQuickReplies(). The functions trim →lowercase user message before iterating through the response rule array in responses.ts.The productMatcher.ts file handles Sanity product retrieval using detectProductType() and detectSkinType(), scans the message for keywords, then the fetch functions run GROQ queries, returning up to three matching products.

The main issue I ran into was that no products were rendering in the chatbot, however the products were being fetched correctly in the console. After tracing the issue I found the  botMessage object in ChatContainer.ts was missing the botResponse.products() was entirely correct, but since there was no error, it was hard to spot without manually checking each function. However,once fixed the products were rendered in correctly.

23/03/26

Today, I finished planning the chatbot feature fully. The main decision was whether to build a single AI-powered chatbot from the start or have  a 2-phase approach with an implementation of a basic rule based system first with product retrieval then do an AI upgrade. I decided on the second method to follow best practices and reduce integration risk by providing a working baseline to validate product retrieval and have a system to fall back on in case the AI chatbot integration failed.I decided to do this by keeping  responseservice.ts as a single integration point so ChatContainer would only ever call getBotResponse() regardless of which phase I was in. This was an essential design decision so I would have to remake the UI at all and make the structure clear and easy to build on.I also created diagrams for both chatbots to demonstrate the system flow.

19/03/26

Successfully implemented the dedicated /wishlist page which displays all the saved items with a ‘remove item’ and ‘add to cart’ button (which removes the item from the wishlist and adds it to the cart. I added an empty wishlist state where it redirects you to the browse products link. I also added a heart icon to the Navbar that links to /wishlist.

I deliberately cut out the shareable URL feature for now since I wanted to move on to my main feature, the chatbot and not rush this feature. I also noticed a bug where the state context passes setTotalPrice(prevTotalQty) instead of prevTotalPrice, so I noted it in the manual testing document /document.



15/03/26

I created the WishlistButton component, then placed it on every product card in the productSection.tsx, positioned in the top right corner of the image. However, the heart icon sits inside a Next.js Link ,clicking it navigates instead of toggling. e.preventDefault() on the wrapper solved this issue. 

I also added persistence to the component to help with page reloads. I did this by adding 2 useEffect hooks (one that loads saved data and the other for when the wishlist items are edited). The localStorage key is wishlist_${user.id} for logged-in users or wishlist_guest for guests to allow for personalised lists. However, I ran into an issue with Local storage persistence, since it would just return null, but this was later fixed by wrapping it in a try/catch. The difficult part was linking it to the Clerk accounts and the login/logout cases. I fixed the bug where logging into an account with no saved wishlist would still show the previous user's items. 



11/03/26

I built the foundation of the wishlist feature. I added a wishlistItems array to StateContext.tsx alongside the existing cart state, with a WishlistItem interface that stores only _id, name, price, image, and slug (I did not add quantity since it’s just to track which items the customer likes). I added functions like addToWishlist(), which checks for duplicates and shows an error toast if the item is already added, and the removeFromWishlist() removes the item using the ID.

The main architectural decision was where to add the wishlist context.I started off with a separate context for the cart state context file logic, but decided on keeping both cart logic and wishlist functionality in one state context file to interact directly to move to cart.

Encountered issues:

The isInWishlist functionality started as a for loop, but was then swapped for .some() to improve readability. 

The UX issue I had was that moveToCart calls onAdd internally, which triggers the function setShowCart(true), so clicking "Move to Cart" from the wishlist page opens the cart popup, which I have left for now, but in the future I would like to modify the cart popup.



08/03/26

Started planning the wishlist implementation by researching how other e-commerce sites integrate wishlist functionality, looked at sites like ASOS, Sephora, and researched how the wishlist data was stored which in most cases was account-based server storage but decided to use local storage for now, since we have clerk auth which we can later build on. I also researched local storage and its limitations, which I thought was fine for now before migrating it to Sanity.

I also looked at a potential extra feature that can be added with extra time to improve the wishlist functionality, like adding shareable wishlist links using URL query params to avoid using a database.



04/03/26

I pulled the product grid out of the page.tsx into its own ProductSection component. The homepage stays as a server component for initial data fetching, while ProductSection becomes a client component for interactivity.

I also added filter tags above the grid that show active filters with an X button to clear, and a live product count that updates as the filter changes.



01/03/26

Finished building the FilterSideBar component today so it received filter state and callbacks, just rendering for now. Also completed the filter cards with collapsible components using local usestate for open/closed with ingredients (defaulting to close since its a long list).

At first I started working on a separate search sidebar but then merged into the FilterSideBar.tsx

I also added a “clear all” button that resets all filters.



25/02/26

There were a couple of ts errors on every .map(), .filter(), .some(), .every() callback. Parameters like (t) or (i) had no type annotation. I fixed them one by one with explicit types: (t: string), (i: string).

I also had to fix the price filter logic so now it just has max prices so users can see all products of a certain type.



21/02/26

Started building the useFilters hook while using a single useState object that holds all the values for the filter, this has also made clearing filters logic a lot easier to implement since you only need one setState({})

For the filtering logic it runs on each product through 5 different checks: search text ,category math,price,skin-type and ingredients.



17/02/26

Fixed the category bug today changed to: [{ type: "string" }] → to: [{ type: "category" }] and the sanity studio category dropdown shows the actual category documents.

Created some category documents and updated the GROQ query and checked it with Sanity Studio.I also started converting my Figma design into the FilterSideBar.tsx file, starting with the filter card and drop-down. 



14/02/26

Started modifying the product schema today.Added skinType as an array of strings with options. Also added ingredients commonly used in skincare. Made both fields optional in ts so older products that dont have them can still exist.

Tested the changes on Sanity Studio which showed up correctly and made a couple of test products.I also realised I need to update the GROQ queries to fetch the new fields.



11/02/26

I decided to spend some time organising how I wanted to implement my filter logic, I decided to put the filter set in the global StateContext with the cart but since filters are only used in the homepage, I decided to make it simpler and add a custom hook. A file that encapsulates all the filter logic,state and values and components to call it.

I spent the majority of my time researching the chatbot since it is a bigger feature and requires more planning since it's also something I'm not familiar with at all.



08/02/26

I evaluated the code so far and tested out the features thoroughly making sure to document any small bugs or features I would like to improve. I will have this in the /document folder. I then reviewed the sprint plan for weeks 2-3 and began gathering design inspirations from various websites for a filtering system.

After some research I realised that most of them fetch the products once and filter from the client side which I also wanted to implement since the catalogues right now arent too populated. This will also avoid Sanity overloading and will also affect latency.

I was able to finalise a Figma frame for the filtering system and start converting to Tailwind CSS.

05/02/26

Completed the order dashboard UI with full responsive design and brand-consistent styling. Designed a friendly message for users without orders, including a "Start Shopping" . Also added full order cards with order details, product list summary address and a collapsible button to allow users to see all order cards quickly.

Added a notification badge system for the different states: paid,shipped,delivered ect.However, I still haven't made it responsive on other devices. I will add that when I have more time.

Main blocker- Cannot verify complete functionality until deployed on Vercel for testing.There is a risk that when I finally deploy and test with real data, I might discover layout issues or rendering/query issues.



01/02/26

Started to build the user-facing dashboard for the order history using the Figma files.Created a new page at app/orders/page.tsx as a server component for better performance. Implemented server-side authentication guard using Clerk's auth function - unauthenticated users are redirected immediately to sign in before any rendering occurs.

Started with Order Card container and main details, some of the Icons and formatting were not aligning in the container.

Testing:

* Added test orders manually and the UI showed up well however the image didn’t render in properly.



28/01/26

I spent a lot of time researching and understanding how webhooks can't work with localhost and designing the order page using figma design and website inspirations.

Local Host only exists in my machine. Stripe servers on the internet can't reach it, which is why payments work but orders aren't created.

Researched optimal solutions to test the Order schema:

* Stripe CLI - Official tool built for this however had windows installation issues with it.
* Vercel - Production-ready with a permanent URL however needed to configure environment variables.

/Documents (for Figma UI order design file)



24/01/26

Focused on creating the Order schema in Sanity and configuring database write permissions.I found issues with field name mismatches between webhooks and the schema, but I fixed this quite early on.

Encountered a critical issue with the sanity client being configured in read-only mode. For webhooks to create orders, I needed write permission.

Testing:

* Webhook endpoint not set up, so I couldn’t test fully but I tested the format in Sanity Studio.



22/01/26

Today, I began implementing Week 1’s order dashboard requirement by researching how to properly link Stripe payments to database orders. However, no order record was found indicating that the issue with my implementation was that payments were succeeding but no order records were being created.

What I researched:

-Studied Stripe webhook documentation again for checkout completed events.

-Reviewed Clerk authentication server-side API for Next.js 14 App Router

-Researched Sanity schema best practices for relational data (orders linked to users)

-Investigated metadata limitations in Stripe (discovered 500 character limit per field)

Started adding clerk authentication to the checkout flow and encountered my first major blocker, the checkout API route needed server-side authentication but initially I was using client-side hooks which caused errors. Another issue I encountered was the metadata initially failed because I was trying to store the entire cart object and product images. This caused the Error “Metadata values can have up to 500 characters”.This issue alone took me a while to debug but after looking through the files carefully I was able to pinpoint the issue and create a minimal cart items array that strips out image URLS before JSON stringifying.

Testing:

* Logged out the user and checked for the correct error and the appropriate message
* Logged-in users can proceed to the checkout page
* Orders can't be created yet webhook isnt implemented 



Term 1

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



26/10/25

 I focused on implementing the product listing under “Best Sellers” on the home page. Using Tailwind CSS  I built a responsive grid layout and added and styled the product card to show the name of the product and price. I integrated the frontend with Sanity CMS by implementing a TypeScript interface for product data and creating a GROQ query to fetch available products. I then tested this new integration by adding more products in Sanity and verified that they automatically updated.

https://www.sanity.io/docs/content-lake/how-queries-work

https://www.sanity.io/docs/apis-and-sdks/image-urls#image-urls-in-queries



23/10/25

I implemented the landing page components consisting of the Navbar and herobanner. I added a responsive navbar that I have styled previously in another project, so I transferred the CSS and changed the logo and colours. I also implemented the HeroBanner section using Tailwind CSS to create a dynamic carousel with placeholder website images. The styling of the shopping cart icon initially gave me a lot of trouble since I used an image and it didn't align correctly and I wasn’t able to syle it, so I opted for an icon from react-icons/ai.



19/10/25

Established project foundation with Next.js app and styling used app routed to start of core application structure, then implemented the main Navbar component. Also addressed a critical build error by correctly configuring the next.config.ts file to handle the external images domain and Sanity's image CDN. Applied initial global styles  and CSS modules, focusing on a cohesive design to match my design idea.



12/10/25 

I created the first schemas for product and category  for basic defining fields such as product name,description,image and category reference. I also watched some tutorials on how to use and set up Clerk for authentication.I also looked up functions needed for making a dynamic cart that updates quantities and adds products.



11/10/25 - Setting up the environment and Sanity research

This week I set up the Next.js environment locally and configured Tailwind CSS, installing all dependencies and testing out the server to ensure it runs correctly. I then moved on to setting up Sanity. I initially encountered some difficulties since I was following an outdated tutorial. After reading the official documentation again, and a recent guide I was able to set it up successfully. I  launched and accessed the /studio. During this process, I learnt more about the schema definitions, structured product data and started planning the fields necessary for my website.



03/10/25 - Refining project idea and working on Term1  plan

I refined my project idea to focus on the skincare industry as it represents a rapidly growing e-commerce sector where AI integration can assist and create a personalised experience for the user. I researched existing skincare websites to identify features I liked from both the user design and useful features related to personalisation and user interactions. 

I also worked on my Term 1 development plan outlining weekly milestones and main objectives I had. While researching potential tools and services, I decided to use Next.js for the frontend with Node.js for the backend. I also found a service called Sanity CMS for managing product data, Stripe for secure payments and Clerk for authentication. Since Clerk and Sanity are new to me, I read up on the official documentation and how to set them up.



29/09/25 - Project brainstorming and configuring GitLab repository:

I began this week with brainstorming potential ideas for my Advanced Web Development project and after reviewing the Moodle guidelines and examples, I decided on creating an e-commerce website incorporating advanced features such as personalised product recommendations,smart search and an AI-powered chatbot assistant. I also researched different technologies that would make it simple to implement these features. I sketched out the initial system concept to present to my supervisor for our meeting. I also set up the GitLab repository by making a new personal access token and successfully cloning the repository to my local environment.









