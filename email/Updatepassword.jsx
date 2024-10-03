export const Updatepassword = ({ name, link }) => (
    <div style={{ fontFamily: 'Arial, sans-serif', color: '#333', lineHeight: '1.6', padding: '20px', maxWidth: '600px', margin: '0 auto', borderRadius: '8px', border: '1px solid #ddd', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <img src="https://company-logo-url.com/logo.png" alt="Company Logo" style={{ maxWidth: '150px' }} />
        </div>

        <div style={{ backgroundColor: '#FF4136', color: '#fff', padding: '20px', borderRadius: '8px', textAlign: 'center', animation: 'pulse 1.5s infinite' }}>
            <h2 style={{ fontWeight: 'bold', letterSpacing: '2px' }}>NTechZy</h2>
        </div>

        <h3 style={{ textAlign: 'center', color: '#FF4136', marginTop: '30px' }}>Hello, {name}</h3>
        <p style={{ textAlign: 'center' }}>
            We received a request to reset your password. You can reset it by clicking the button below.
        </p>

        <div style={{ textAlign: 'center', margin: '20px 0' }}>
            <a href={link} style={{ backgroundColor: '#FF4136', color: '#fff', padding: '10px 20px', borderRadius: '4px', textDecoration: 'none' }}>
                Reset Password
            </a>

            <br />
        </div> 

        <p>If you didn't request a password reset, please ignore this email. Your password will remain unchanged.</p>

        <p style={{ fontSize: '12px', color: '#888' }}>
            <b>Note:</b> This reset link is valid for a limited time only for security reasons.
        </p>

        <p style={{ textAlign: 'center', marginTop: '30px', color: '#555' }}>
            Thank you for using NTech Zy! We're here to assist you if you have any questions.
        </p>

        <hr style={{ margin: '30px 0', borderColor: '#ddd' }} />

        <p style={{ fontSize: '12px', color: '#888', textAlign: 'center' }}>
            *** Please do not reply to this email as it is automatically generated. ***
        </p>

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="#FF4136" viewBox="0 0 16 16" width="50" height="50">
                <path d="M8 0a8 8 0 1 0 8 8A8 8 0 0 0 8 0zm3.993 9.93c.07.174.07.395.07.587 0 2.81-1.89 4.82-4.82 4.82a4.823 4.823 0 0 1-4.82-4.82c0-.19 0-.41.07-.587a3.47 3.47 0 0 1-.07-.587 3.484 3.484 0 0 1 3.42-3.42h2.82a3.47 3.47 0 0 1 3.42 3.42c0 .192 0 .413-.07.587z" />
            </svg>
        </div>

        {/* CSS for pulse animation */}
        <style>{`
            @keyframes pulse {
                0% {
                    transform: scale(1);
                }
                50% {
                    transform: scale(1.05);
                }
                100% {
                    transform: scale(1);
                }
            }
        `}</style>
    </div>
);
