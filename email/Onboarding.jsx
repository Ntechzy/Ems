export const OnBoarding = ({
    name, employee_id, password, link
}) => (
    <div style={{ fontFamily: 'Arial, sans-serif', color: '#333', lineHeight: '1.6', padding: '20px', maxWidth: '600px', margin: '0 auto', borderRadius: '8px', border: '1px solid #ddd', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <img src="https://company-logo-url.com/logo.png" alt="Company Logo" style={{ maxWidth: '150px' }} />
        </div>

        <div style={{ backgroundColor: '#007BFF', color: '#fff', padding: '20px', borderRadius: '8px', textAlign: 'center', animation: 'bounce 2s infinite' }}>
            <h2 style={{ fontWeight: 'bold', letterSpacing: '2px' }}>NTech Zy</h2>
        </div>

        <h3 style={{ textAlign: 'center', color: '#007BFF', marginTop: '30px' }}>Welcome, {name}!</h3>
        <p style={{ textAlign: 'center' }}>
            We are excited to have you as part of our team. Your journey begins now!
        </p>
        
        <p>
            To proceed, please log in to our company’s employee portal. Click the button below to access your account:
        </p>
        <div style={{ textAlign: 'center', margin: '20px 0' }}>
            <a href={link} style={{ backgroundColor: '#007BFF', color: '#fff', padding: '10px 20px', borderRadius: '4px', textDecoration: 'none' }}>
                Login to Portal
            </a>
        </div>
        <p>Your login credentials are as follows:</p>
        <ul style={{ listStyleType: 'none', padding: 0 }}>
            <li><b>Username:</b> {employee_id}</li>
            <li><b>Password:</b> {password}</li>
        </ul>
        <p style={{ fontSize: '12px', color: '#888' }}>
            <b>Note:</b> For security purposes, please change your password after logging in for the first time.
        </p>
        <p style={{ textAlign: 'center', marginTop: '30px', color: '#555' }}>
            Thank you for joining us. We look forward to working with you!
        </p>
        <hr style={{ margin: '30px 0', borderColor: '#ddd' }} />
        <p style={{ fontSize: '12px', color: '#888', textAlign: 'center' }}>
            *** Please do not reply to this email as it is automatically generated. ***
        </p>
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="#007BFF" viewBox="0 0 16 16" width="50" height="50">
                <path d="M8 0a8 8 0 1 0 8 8A8 8 0 0 0 8 0zm3.993 9.93c.07.174.07.395.07.587 0 2.81-1.89 4.82-4.82 4.82a4.823 4.823 0 0 1-4.82-4.82c0-.19 0-.41.07-.587a3.47 3.47 0 0 1-.07-.587 3.484 3.484 0 0 1 3.42-3.42h2.82a3.47 3.47 0 0 1 3.42 3.42c0 .192 0 .413-.07.587z" />
            </svg>
        </div>

        {/* CSS for bounce animation */}
        <style>{`
            @keyframes bounce {
                0%, 20%, 50%, 80%, 100% {
                    transform: translateY(0);
                }
                40% {
                    transform: translateY(-20px);
                }
                60% {
                    transform: translateY(-10px);
                }
            }
        `}</style>
    </div>
);
