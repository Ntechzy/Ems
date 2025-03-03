export const SalarySlipEmail = ({ name, month, baseSalary, totalAbsentDays, extraDeductionAmount, salary, reason }) => (
    <div style={{
        fontFamily: 'Arial, sans-serif',
        color: '#333',
        lineHeight: '1.6',
        padding: '20px',
        maxWidth: '700px',
        margin: '0 auto',
        borderRadius: '10px',
        border: '1px solid #ddd',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        backgroundColor: '#f9f9f9'
    }}>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <img
                src="https://media.licdn.com/dms/image/v2/D560BAQG5xHtNyuvN2w/company-logo_200_200/company-logo_200_200/0/1707762485397/ntechzy_logo?e=2147483647&v=beta&t=QloYtkuE_thYkMrC5bQJLMrlB3UwKOibD88Hy5V7SfE"
                alt="Company Logo"
                style={{ maxWidth: '150px' }}
            />
        </div>

        <div style={{ backgroundColor: '#FF4136', color: '#fff', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
            <h2 style={{ fontWeight: 'bold', letterSpacing: '2px', fontSize: '24px' }}>NTechZy</h2>
        </div>

        <h3 style={{ textAlign: 'center', color: '#FF4136', marginTop: '20px', fontSize: '20px' }}>
            Salary Slip for {month}
        </h3>
        <p style={{ textAlign: 'center', fontSize: '16px', color: '#555' }}>
            Dear {name}, please find your salary details below for the month of {month}.
        </p>

        <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', marginTop: '30px', backgroundColor: '#fff' }}>
            <div style={{ marginBottom: '20px' }}>
                <strong style={{ fontSize: '16px' }}>Employee Details:</strong>
                <p><strong>Name:</strong> {name}</p>
                <p><strong>Month:</strong> {month}</p>
            </div>

            <div style={{ marginBottom: '20px' }}>
                <strong style={{ fontSize: '16px' }}>Earnings:</strong>
                <p><strong>Base Salary:</strong> ₹{baseSalary}</p>
            </div>

            <div style={{ marginBottom: '20px' }}>
                <strong style={{ fontSize: '16px' }}>Deductions:</strong>
                <p><strong>Absent Days:</strong> {totalAbsentDays} day(s)</p>
                <p><strong>Extra Deduction:</strong> ₹{extraDeductionAmount}</p>
                <p><strong>Extra Deduction Reason:</strong> {reason}</p>
            </div>

            <div style={{ marginBottom: '20px' }}>
                <strong style={{ fontSize: '16px' }}>Net Pay:</strong>
                <p><strong>Final Salary:</strong> ₹{salary}</p>
            </div>
        </div>

        <p style={{ fontSize: '14px', color: '#555', marginTop: '30px' }}>
            If you have any questions or discrepancies, please reach out to the HR department at hr@ntechzy.in.
        </p>

        <p style={{ fontSize: '12px', color: '#888', textAlign: 'center' }}>
            <strong>Note:</strong> This salary slip is generated for your records and should be kept confidential.
        </p>

        <p style={{ textAlign: 'center', marginTop: '30px', fontSize: '14px', color: '#555' }}>
            Thank you for your continued dedication and contribution to NTechZy!
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
