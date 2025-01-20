# ByteMe-11-SUSTAIN-AI-THON
# **Smart Food Waste Management System
## **Brief Introduction**
The **Smart Food Waste Management System** is a platform designed to minimize food wastage by connecting food donors with recipients in need. This system streamlines the process of matching surplus food from donors (restaurants, cafes, etc.) with organizations or individuals who can utilize it efficiently. The project also incorporates a matching algorithm that considers food type, quantity, location, and urgency to ensure effective distribution. The project also incorporates an algorithm which predicts the future response of the donor and matches it with the recipients need.
## **Workflow Diagram**
'''mermaid
graph TD;
A[Donor Submits Form] --> B[Data Stored in Donor CSV]
C[Recipient Submits Form] --> D[Data Stored in Recipient CSV]
B --> E[Matching Algorithm]
D --> E[Matching Algorithm]
E --> F[Generate Matches]
F --> G[Update Matches CSV]
G --> H[Display Matches on UI]
