import React from "react";

interface Campaign {
    _id: string;
    product: string;
    sentCount: number;
    totalUsers: number;
    status: "pending" | "sending" | "completed";
}

interface CampaignStatusProps {
    campaign?: Campaign;
    isSending?: boolean;
}

const CampaignStatus: React.FC<CampaignStatusProps> = ({ campaign, isSending }) => {
    if (isSending && !campaign) return <span>Sending...</span>;

    if (!campaign) return <span>Pending</span>;

    switch (campaign.status) {
        case "pending":
            return <span>Pending</span>;
        case "sending":
            return (
                <span>
                    Sending ({campaign.sentCount}/{campaign.totalUsers})
                </span>
            );
        case "completed":
            return (
                <span>
                    Sent ({campaign.sentCount}/{campaign.totalUsers})
                </span>
            );
        default:
            return <span>Unknown</span>;
    }
};

export default CampaignStatus;
