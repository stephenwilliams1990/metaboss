import { web3, Wallet } from "@project-serum/anchor";
import { Token, TOKEN_PROGRAM_ID } from "@solana/spl-token";


export async function transfer(tokenMintAddress, wallet, to, connection, amount) {

    const mintPublicKey = new web3.PublicKey(tokenMintAddress)
    const destPublicKey = new web3.PublicKey(to)
    
    const mint = new Token(
        connection,
        mintPublicKey,
        TOKEN_PROGRAM_ID,
        wallet.publicKey
    )

    const info = await mint.getMintInfo()

    // Get the token account of the fromWallet Solana address, if it does not exist, create it
    const fromTokenAccount = await mint.getOrCreateAssociatedAccountInfo(
        wallet.publicKey,
    );
    
    const associatedDestinationTokenAddr = await Token.getAssociatedTokenAddress(
        mint.associatedProgramId,
        mint.programId,
        mintPublicKey,
        destPublicKey
      );

    const receiverAccount = await connection.getAccountInfo(associatedDestinationTokenAddr);
    
    console.log(associatedDestinationTokenAddr.toString())
    
    const transaction = new web3.Transaction()

    // if receiver account doesn't exist yet, create it
    if (receiverAccount === null) {

        transaction.add(
          Token.createAssociatedTokenAccountInstruction(
            mint.associatedProgramId,
            mint.programId,
            mintPublicKey,
            associatedDestinationTokenAddr,
            destPublicKey,
            wallet.publicKey
          )
        )
    
    } else {
        console.log("Account already exists")
    }
    
    // now transfer

    transaction.add(
        Token.createTransferInstruction(
            TOKEN_PROGRAM_ID,
            fromTokenAccount.address,
            associatedDestinationTokenAddr,
            wallet.publicKey,
            [],
            amount
        )
    );

    // Sign transaction, broadcast, and confirm
    let numTries = 3;            
    while (true) {
        try {
            const signature = await web3.sendAndConfirmTransaction(
                connection,
                transaction,
                [wallet],
                {commitment: 'confirmed'},
            );
            break;
        } catch (err) {
            setTimeout(() => {  console.log('Error in confirming transaction, retry number: ', 4 - numTries ); }, 100000);
            if (--numTries == 0) throw err;
        }
    }
    
};

