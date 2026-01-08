# AFCON 2025 Predictor - Road to the Final

## Project Overview
This project is an interactive web application designed for football fans to predict the outcome of the **Africa Cup of Nations (AFCON) 2025**. Users can select winners from the Quarter-Finals through to the Grand Final, visualizing their "Road to the Final". The app features a premium, dark-themed UI with glassmorphism effects and allows users to export high-quality images of their predictions for social media sharing.

## Tech Stack
The application is built using a modern, robust web development stack:

- **Framework:** [Next.js 14](https://nextjs.org/) (App Router) - For server-side rendering, routing, and overall application structure.
- **Language:** [TypeScript](https://www.typescriptlang.org/) - Ensuring type safety and code reliability.
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) - Using the latest alpha features for a highly responsive and customizable design system, including custom radial gradients and glassmorphism utilities.
- **Animations:** [Framer Motion](https://www.framer.com/motion/) - Powering smooth transitions, entry animations, and interactive feedback (e.g., card selection, mobile zoom effects).
- **State Management:** [Zustand](https://github.com/pmndrs/zustand) - A small, fast, and scalable bearbones state-management solution to track user predictions (winners of each match) across the app.
- **Icons:** [Lucide React](https://lucide.dev/) - For consistent, clean SVG icons (Trophy, Share, Download, etc.).
- **Image Generation:** [html-to-image](https://github.com/bubkoo/html-to-image) - Used to convert the HTML DOM of the bracket into a high-quality JPEG image for sharing.
- **Flags:** [FlagCDN](https://flagcdn.com/) - Integrating SVG county flags via ISO codes for crisp rendering on all devices.

## Key Features

1.  **Interactive Bracket System:**
    - Visual tree structure representing QF -> SF -> Final progression.
    - One-click selection logic: Selecting a winner automatically advances them to the next round.
    - Smart "Cascading Reset": Changing a QF winner automatically clears subsequent dependent matches to ensure data consistency.

2.  **Premium UI/UX:**
    - **Dark Mode Aesthetic:** Custom green/red/black gradient background representing African football themes.
    - **Glassmorphism:** Translucent cards with subtle borders and blurring effects (`backdrop-blur`).
    - **Responsive Design:**
        - **Desktop:** Full panoramic view of the bracket.
        - **Mobile:** Horizontal "snap" scrolling with a unique overview zoom-out interaction.

3.  **Social Sharing:**
    - Custom export engine generating a `1920x1080` (landscape) image of the user's full bracket.
    - Export includes the user's selections, a "Champion" highlight card, and branding.

4.  **Flag System:**
     - Replaced inconsistent emoji rendering with high-quality SVG images to ensure flags look perfect on Windows/Chrome and mobile devices.

## Development Process

### 1. Foundation
We started by scaffolding a Next.js app and configuring Tailwind CSS v4. The `globals.css` was heavily customized to define the core "premium dark" variables and radial mesh gradients.

### 2. Core Components
- **MatchCard:** The building block of the bracket. Designed to handle `Team` objects, display selection states (winners/losers), and animate into view.
- **Store (`useBracketStore`):** Created a Zustand store to hold the `winners` object mapping match IDs (e.g., `q1`, `sf1`) to team names. This separated the logic from the UI.

### 3. Layout & Responsiveness
We implemented a center-out layout logic for desktop and a snap-scroll carousel for mobile. A key challenge was managing the "connectors" (lines between matches), which were custom-drawn using Tailwind borders.

### 4. Interactive Features
Added the logic for "disqualifying" teams (dimming them) and advancing winners. Implemented the 'Reset' functionality to clear the bracket.

### 5. Export Optimization
Iteratively refined the `html-to-image` export feature:
- Switched from portrait to landscape to show the *full* bracket tree.
- Optimized text scaling and visibility for Instagram/mobile sharing.
- Fixed cross-browser issues (font rendering bugs and flag emoji support).

## Bracket Implementation Details

This section details the technical approach to building the interactive bracket system.

### 1. Logic & State Management
The core logic is handled by a global **Zustand** store (`useBracketStore.ts`). This ensures the state is accessible anywhere in the app and persists across reloads (via `persist` middleware).

*   **Data Structure:** The state is a flat object `winners: { [matchId: string]: string }`. For example, `winners.q1` holds the name of the Quarter Final 1 winner.
*   **Winner Propagation:** When a user selects a team in a MatchCard:
    1.  The `setWinner(matchId, teamName)` action is triggered.
    2.  The store updates the winner for that match.
    3.  **Cascading Reset:** Crucially, if a user changes their mind (e.g., changing the QF winner from Mali to Senegal), the store logic detects this and **automatically resets** any subsequent predictions that depended on the old winner (e.g., clearing the Semi-Final winner). This prevents impossible states (like a team winning a Semi-Final after losing the Quarter-Final).

### 2. Component Architecture
The UI is composed of modular, reusable components:

*   **`MatchCard.tsx`**: The primary UI unit.
    *   **Props:** Accepts `team1`, `team2`, `winner` (current state), and an `onSelect` callback.
    *   **Visuals:** Uses `framer-motion` for entry animations (`initial={{ opacity: 0 }}`). It conditionally renders styles based on the `isWinner` or `isLost` state (e.g., green borders for winners, dimmed opacity for losers).
    *   **Flag Rendering:** Uses the `FlagImage` component to render consistently sized SVG identifiers.
*   **`FlagImage.tsx`**: A wrapper around the `img` tag that constructs the correct URL for `flagcdn.com` based on the team's ISO code. This solves browser inconsistencies with emoji rendering.
*   **Connectors:** The visual lines connecting match cards are simpler HTML `div` elements with absolute positioning and Tailwind border classes (`border-t`, `border-r`, `border-l`), creating the "tree" effect.

### 3. Layout Strategy
*   **Center-Out Design:** The desktop layout uses a 3-column Flexbox structure:
    *   **Left Column:** QF1, QF4 -> SF1
    *   **Center Column:** Grand Final
    *   **Right Column:** QF2, QF3 -> SF2
    *   *Note: On desktop, the Right Bracket column uses `flex-row-reverse` to mirror the structure of the Left Bracket symmetrically.*
*   **Mobile Adaptation:** On mobile, we switch to a horizontal snapping scroll view (`overflow-x-auto snap-x`). This allows users to swipe through the rounds (Left Bracket -> Center -> Right Bracket) naturally.

## Running Locally

1.  **Install dependencies:**
    ```bash
    npm install
    ```

2.  **Run development server:**
    ```bash
    npm run dev
    ```

3.  Open [http://localhost:3000](http://localhost:3000) with your browser.

## Project Structure
- `app/`: Next.js app router files (`page.tsx`, `layout.tsx`).
- `components/`: Reusable UI components (`MatchCard.tsx`, `Navbar.tsx`, `FlagImage.tsx`).
- `store/`: State management logic (`useBracketStore.ts`).
- `lib/`: Utilities (`utils.ts` for class merging).
