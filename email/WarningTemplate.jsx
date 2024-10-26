export const WarninTemplate = ({ warningMessage }) => (
    <div style={{ fontFamily: 'Arial, sans-serif', color: '#333', lineHeight: '1.6', padding: '20px', maxWidth: '600px', margin: '0 auto', borderRadius: '8px', border: '1px solid #ddd', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <img src="https://media.licdn.com/dms/image/v2/D560BAQG5xHtNyuvN2w/company-logo_200_200/company-logo_200_200/0/1707762485397/ntechzy_logo?e=2147483647&v=beta&t=QloYtkuE_thYkMrC5bQJLMrlB3UwKOibD88Hy5V7SfE" alt="Company Logo" style={{ maxWidth: '150px' }} />
        </div>

        <div style={{ backgroundColor: '#FF4136', color: '#fff', padding: '20px', borderRadius: '8px', textAlign: 'center', animation: 'bounce 2s infinite' }}>
            <h2 style={{ fontWeight: 'bold', letterSpacing: '2px', margin: 0 }}>Warning Notification</h2>
        </div>

        <h3 style={{ textAlign: 'center', color: '#FF4136', marginTop: '30px' }}>Dear Employee,</h3>
        <p style={{ textAlign: 'center', color: '#555' }}>
            This is to inform you of the following warning:
        </p>

        <div style={{ backgroundColor: '#ffe5e5', padding: '15px', borderRadius: '8px', marginTop: '20px', color: '#555' }}>
            <p>{warningMessage}</p>
        </div>

        <p style={{ textAlign: 'center', marginTop: '30px', color: '#555' }}>
            Please take this notice seriously and reach out if you have any questions.
        </p>

        <hr style={{ margin: '30px 0', borderColor: '#ddd' }} />
        <p style={{ fontSize: '12px', color: '#888', textAlign: 'center' }}>
            *** This email was automatically generated. Please do not reply. ***
        </p>

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="#FF4136" viewBox="0 0 16 16" width="50" height="50">
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
