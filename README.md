# CryptoCares
Decentralized Charity System using the XRP Ledger

Problem Statement: The existing charity system lacks transparency, accountability, and trust, leading to inefficiencies and potential fraud, 
which undermines the effectiveness of charity. Since donors are not able to track their donations, there is unclear distribution of funds and
a lack of transparency in how the donations are being used. CryptoCares can address these issues by providing a transparent, decentralized,
and secure system for tracking donations, ensuring that funds are being used as intended, and establishing a high level of trust between
donors and charities.

Aim: This project aims to develop a secure, transparent, and efficient platform built on the XRP Ledger for charitable giving that will give 
donors more confidence that their donations will be used for the intended purpose, ultimately increasing their trust and participation in more
philanthropic activities.

System Overview: 
CryptoCares will have four users: donors, beneficiaries, providers, and admins. There will be user registration for donors, beneficiaries, 
and providers, where anyone can register as a donor, but to register as a beneficiary or a provider, they must provide some proof that they 
are legitimate. This proof will be looked over by the admin, and if the admin thinks they are legitimate, they will be approved and be able 
to use the system’s functionalities. Donors will be able to donate XRP to beneficiaries' projects. Beneficiaries will be able to request to 
create a fundraising project for a certain cause, where they will provide details such as the project title, description, location, end date,
target amount, a new wallet for the project, and some proof that the project they are trying to create is for a good cause. Similarly, 
providers will be able to request to create a service to be provided on the platform, where they will also provide some proof that they can 
provide those services. 

Every transaction to and from the project will be shown on the platform, so other users can see what is happening. If the beneficiary wants 
to get a particular service for the project, they will request a service provider for their service. The beneficiary will request a service 
according to the price incurred for using the service for a day, which will be specified by the service provider. When the request is made, 
the funds (in XRP) will be transferred from the project’s wallet to an escrow (smart contract). If the service request is declined by the 
provider, then the funds will be transferred back to the beneficiaries’ wallets. If it is approved by the provider, then the beneficiary will 
have the option to confirm that the service requested was delivered. When the service requested is delivered by the provider to the 
beneficiary and the beneficiary confirms the payment, then the funds will automatically be transferred from the escrow to the provider’s 
wallet.

Some things to note: a beneficiary can only create one project at a time, so he or she will not be able to create another project until an 
existing project ends; a beneficiary cannot request services until the existing project ends (a project will end either if the project 
reaches the end date or if the project reaches the target amount specified during the project creation). The administrators will be able to 
approve or decline the beneficiaries' requests to start a project and the providers' requests to provide services to the beneficiaries. They 
will also be able to manage the users. The users, projects, services, transaction IDs, and proof-of-need (i.e., the proof that a beneficiary 
is trying to start a campaign for the right cause and the proof that a provider has the capabilities to provide services) will be stored on 
Mongo, while the transactions and the service requests will be stored on the XRPL. The escrow will have five functions: making a donation, 
making a service request, approving a service request, declining a service request, and confirming a service payment.

Conclusion: The development of this decentralized application (DApp) aims to address the challenges faced by charitable organizations in 
terms of transparency, accountability, and trust. By leveraging blockchain technology and a range of modern development tools and platforms, 
a secure, transparent, and efficient platform for charitable giving can be created.
