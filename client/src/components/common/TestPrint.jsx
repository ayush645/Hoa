import React, { useState } from 'react';

const DownloadPDFButton = () => {
    const [loading, setLoading] = useState(false);

    const handleDownload = async () => {
        setLoading(true);

        const categoryId = '677e6c2ffd283f7a4a3c0b76';  // Replace with actual category ID
        const month = 'January';  // Replace with the selected month
        const ownerId = "677a39a4d8200e49b1149598"

        try {
            const response = await fetch(`${process.env.REACT_APP_BASE_URL}/print/generate-general-report?categoryId=${categoryId}&ownerId=${ownerId}`);
            if (response.ok) {
                // Create a blob from the response
                const blob = await response.blob();
                
                // Create an anchor element and trigger the download
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = `payment_details_${month}.pdf`;
                link.click();
            } else {
                alert('Failed to generate PDF');
            }
        } catch (error) {
            console.error('Error downloading PDF:', error);
            alert('Error downloading PDF');
        }

        setLoading(false);
    };

    return (
        <button onClick={handleDownload} disabled={loading}>
            {loading ? 'Generating PDF...' : 'Download Payment Details PDF'}
        </button>
    );
};

export default DownloadPDFButton;
