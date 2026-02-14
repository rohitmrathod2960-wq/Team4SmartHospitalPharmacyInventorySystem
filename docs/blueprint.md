# **App Name**: DefenseLink

## Core Features:

- User Authentication: Secure user authentication with role-based access control (Admin, Manager, Staff) using JWT and bcrypt for password hashing.
- Forgot Password Flow: Implements a secure forgot password flow using OTP verification sent via email using Nodemailer.
- Equipment Management: Admin and Manager roles can add, edit, and delete equipment, specifying details such as name, category, serial number, and quantity. Admin and Manager also have features for stock update and assign equipment, whereas the Staff can request it.
- Role-Based Dashboards: Custom dashboards for Admin, Manager, and Staff roles providing relevant information and actions.
- Equipment Assignment and Tracking: Track equipment assignments, status (Available/Assigned/Maintenance), and history within the system, enabling staff to view equipment.
- Reporting and Analytics: Managers can view reports on equipment usage, stock levels, and assignments to inform decision-making.
- AI-Powered Predictive Maintenance Tool: Generative AI tool that helps predict equipment maintenance needs.  It considers equipment usage, historical failure data, and manufacturer specifications to generate maintenance schedules, helping prevent unexpected downtime and extend the lifespan of equipment. Managers can input or update these factors, influencing the suggestions.

## Style Guidelines:

- Primary color: Strong blue (#3B82F6) to convey trust and security, aligning with the theme of defense.
- Background color: Light grey (#F9FAFB) providing a soft, neutral backdrop that enhances focus on content.
- Accent color: Soft violet (#8B5CF6) as an accent, providing a modern, high-tech, and forward-looking feel.
- Body and headline font: 'Poppins', a geometric sans-serif, providing a clean, modern, and readable interface. Note: currently only Google Fonts are supported.
- Use a set of consistent icons for equipment types, status indicators, and user roles to enhance usability.
- Implement a card-based layout with centered authentication forms and role selection cards for a modern and responsive design.
- Use subtle transitions and loading spinners to enhance the user experience during form submissions and data loading.