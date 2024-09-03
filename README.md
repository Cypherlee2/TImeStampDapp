# Document Timestamping DApp

This decentralized application (DApp) implements a document timestamping and verification system using Cartesi Rollups technology. It allows users to timestamp documents and later verify their existence and timestamp.

## Features

1. Timestamp documents by generating a hash and storing it with the current timestamp
2. Verify previously timestamped documents
3. Inspect all stored timestamps or hashes

## Installation

1. Clone this repository
2. Install dependencies:
   ```
   npm install viem crypto
   ```

## Running the DApp

Start the DApp using the Cartesi Rollups environment. Refer to the Cartesi documentation for detailed instructions on how to run a Rollups DApp.

## Interacting with the DApp

### Sending Inputs (Advance Requests)

To interact with the DApp, send a JSON payload with the following structure:

1. Timestamp a document:

   ```json
   {
     "action": "timestamp",
     "document": "Your document content here"
   }
   ```

2. Verify a document:
   ```json
   {
     "action": "verify",
     "hash": "document_hash_here"
   }
   ```

### Inspecting the State

You can inspect the DApp's state using the following routes:

1. Get all timestamps:

   ```
   all_timestamps
   ```

2. Get all document hashes:
   ```
   hashes
   ```

## How it Works

1. The DApp uses SHA-256 for hashing documents.
2. When a document is timestamped, its hash and the current timestamp are stored.
3. Verification checks if a given hash exists in the stored data and returns its timestamp.
