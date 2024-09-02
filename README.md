# Document Timestamp & Verification

Document Timestamp & Verification DApp is powered by storing and retrieving document hashes. It manages the document hashes with a SHA-256 hash in the DApp. Thereafter, it timestamps the document, and the user can verify the document using the hash. This helps to determine if the document was timestamped and provides the timestamp when the document was first recorded.

# Installation Instructions

([]https://docs.cartesi.io/cartesi-rollups/1.5/development/installation/)

# Compiling Instructions

1. Clone the repository
2. Run `cd <project-directory>`
3. Run `cartesi build`
4. Run `cartesi run`
5. Run `cartesi send` on a new terminal tab and send a generic input of the document and the action (timestamp or verify) to the application following the necessary steps.
