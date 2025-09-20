import React, { useState } from 'react';
import { motion } from 'framer-motion';
import DashboardHeader from '../components/DashboardHeader';
import Dashboard from '../components/Dashboard';
import MarketplaceSection from '../components/MarketplaceSection';
import ContractorSelection from '../components/ContractorSelection';
import InstallationUpdates from '../components/InstallationUpdates';
import ImageCapture from '../components/ImageCapture';
import CallScheduling from '../components/CallScheduling';
import PaymentSection from '../components/PaymentSection';
import InstallationScheduling from '../components/InstallationScheduling';

type ComponentType =
    | 'dashboard'
    | 'marketplace'
    | 'contractors'
    | 'installation-updates'
    | 'image-capture'
    | 'call-scheduling'
    | 'payment'
    | 'installation-scheduling';

interface ComponentConfig {
    id: ComponentType;
    name: string;
    description: string;
    component: React.ReactNode;
}

const Home = () => {
    const [activeComponent, setActiveComponent] = useState<ComponentType>('dashboard');
    const [notifications] = useState([
        { id: 1, title: 'Maintenance Due', message: 'System maintenance scheduled for tomorrow', read: false },
        { id: 2, title: 'Water Level Alert', message: 'Tank level dropped below 20%', read: false },
        { id: 3, title: 'Community Event', message: 'Water conservation meetup this Friday', read: true },
        { id: 4, title: 'Reward Points', message: 'You earned 50 points for water savings!', read: false }
    ]);

    const unreadCount = notifications.filter(n => !n.read).length;

    // Configuration for all available components
    const components: ComponentConfig[] = [
        {
            id: 'dashboard',
            name: 'Dashboard',
            description: 'Main dashboard with stats and overview',
            component: <Dashboard />
        },
        {
            id: 'marketplace',
            name: 'Marketplace',
            description: 'Browse and purchase rainwater harvesting systems',
            component: <MarketplaceSection onComplete={() => setActiveComponent('contractors')} />
        },
        {
            id: 'contractors',
            name: 'Contractors',
            description: 'Find and select installation contractors',
            component: <ContractorSelection onScheduleCall={() => setActiveComponent('call-scheduling')} />
        },
        {
            id: 'installation-updates',
            name: 'Installation Updates',
            description: 'Track installation progress and updates',
            component: <InstallationUpdates />
        },
        {
            id: 'image-capture',
            name: 'Image Analysis',
            description: 'Upload and analyze rooftop images',
            component: <ImageCapture onAnalysisComplete={() => setActiveComponent('marketplace')} />
        },
        {
            id: 'call-scheduling',
            name: 'Call Scheduling',
            description: 'Schedule consultation calls with contractors',
            component: <CallScheduling contractorId={1} onCallScheduled={() => setActiveComponent('payment')} />
        },
        {
            id: 'payment',
            name: 'Payment',
            description: 'Complete payment for services',
            component: <PaymentSection onPaymentComplete={() => setActiveComponent('installation-scheduling')} />
        },
        {
            id: 'installation-scheduling',
            name: 'Installation Scheduling',
            description: 'Schedule installation date and time',
            component: <InstallationScheduling onInstallationScheduled={() => setActiveComponent('dashboard')} />
        }
    ];

    const currentComponent = components.find(comp => comp.id === activeComponent);

    return (
        <div className="min-h-screen bg-gradient-card">
            {/* Header */}
            <DashboardHeader
                unreadNotificationsCount={unreadCount}
                pendingInstallationUpdates={1}
                onNavigate={setActiveComponent}
                useRouterLinks={false}
            />

            {/* Dynamic Component Area */}
            <main className="relative">
                <motion.div
                    key={activeComponent}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                >
                    {currentComponent?.component}
                </motion.div>
            </main>
        </div>
    );
};

export default Home;