# Match Match

[![Netlify Status](https://api.netlify.com/api/v1/badges/1619d454-12a3-4fcb-92b2-3449c1a4ab43/deploy-status)](https://app.netlify.com/sites/matchmatch/deploys)

> https://matchmatch.netlify.com/

## Introduction

Welcome to **Match Match**: yet another take on the beloved [concentration card game](<https://en.wikipedia.org/wiki/Concentration_(card_game)>).

This implementation focuses more on code and correctness and less on design, usability and accessibility (for now.) To provide structure and readability, there is a clear separation of the game logic (`./src/game/`) and the consuming game view (`./src/index.html`, `./src/index.ts`, `./src/pixabay.ts` and `./src/styles.css`). In that sense, the view is loosely coupled and replaceable with e.g. a React app as the user interface complexity grows. Similarly, the internal game logic is abstracted and can be refactored without changing its depending view(s). Correctness is pursued using a game API that lends itself well to unit testing. This is partly achieved through the use of dependency injection.

## Further Development

Further development will focus more on the look and feel of the game: adding a nicer design, animations etc. However, there is one glaring flaw that needs initial fixing: The implementation takes the happy path on several occasions and doesn't mitigate errors caused when e.g. the external image provider is down or returns a different response than the one expected. Error handling and sensible defaults should be applied.

Another smaller pain point is the fact that images are lazy-loaded when the mouse hovers the back of a card. Lazy-loading of images is important to ensure a fast, scalable and pleasant user experience. However, there might be better solution than relying on `mouseenter` which might not work on all devices.

Among the missing features that could be added are:

- Giving visual feedback when two cards succeed or fail to pair up.
- Giving visual feedback when the game has ended.
- Making it possible to restart the game.
- Collecting a score based on the number of draws.
- Making it possible to enter a custom image query to change the game theme.
- Making it possible to change the number of cards.
- Using UUIDs for cards to make it harder to cheat.
- Giving images randomised file names to make it harder to cheat.
- Storing a hash of each image to ensure their uniqueness.

It would also be interesting to experiment with sound and `alt` attributes to make the game accessible to visually impaired users.

## Setup

To run a local development version of the game, add an `.env` file with a [Pixabay](https://pixabay.com) API key:

```
// .env
PIXABAY_API_KEY=...
```
