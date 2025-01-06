import React, { useState } from 'react';

const DownloadPDFButton = () => {
    const [loading, setLoading] = useState(false);

    const handleDownload = async () => {
        setLoading(true);

        const categoryId = '6778e8b7c2bc940e1d629e92';  // Replace with actual category ID
        const month = 'January';  // Replace with the selected month
        const ownerId = "677a39a4d8200e49b1149598"

        try {
            const response = await fetch(`http://localhost:8080/api/v1/print/generate-pdf-owner?categoryId=${categoryId}&ownerId=${ownerId}`);
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
