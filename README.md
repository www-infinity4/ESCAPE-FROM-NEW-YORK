# Snake’s Revenge: Escape from New York

Play: https://www-infinity4.github.io/ESCAPE-FROM-NEW-YORK/

Twenty illustrated scenes are available across two ten-scene levels, toward a planned 100-scene adventure. Level 1 features classic rock; Level 2, Rooftops to the Harbor, features 1990s alternative. Each scene has its own question, hint, artwork, and YouTube track. Browser playback restrictions may require tapping the visible player. Unavailable tracks include a direct YouTube Music link.

Progress is saved in this browser. Wrong answers can be retried; completing all ten scenes finishes a level. The new title artwork also supplies the social-sharing preview.

## StarCoin rewards

- Complete a level: 0.1 STAR_COIN, once per level per wallet.
- Share the game: 0.1 STAR_COIN, once per wallet.
- Share a song: 0.1 STAR_COIN, once per distinct song per wallet.

Native sharing must resolve successfully. Clipboard fallback requires explicit confirmation after sharing; copying alone and canceled shares do not earn rewards. These are device-local, self-reported rewards, not server-verified distribution.

Uses the shared Infinity wallet engine from Mint-For-Infinity and the same local-storage wallet used by StarQuest’s unified-wallet integration on this GitHub Pages origin. It does not update StarQuest’s separate cloud ledger or synchronize across browsers/devices. The final correct answer credits the level immediately. The first award creates a local unified wallet if none is connected. Saved completed levels and pending rewards are recovered on load and focus; repeated recovery never duplicates credits. Wallet credits use deterministic event IDs to prevent duplicate awards.

## Validation

JavaScript syntax checks, full PNG decoding, wallet regression tests, and browser-DOM integration checks cover level progression, answer retries, resumed progress, pending claims, duplicate protection, share cancellation, and clipboard confirmation. Artwork generation prompts are recorded in docs/level-02-art-prompts.json.
