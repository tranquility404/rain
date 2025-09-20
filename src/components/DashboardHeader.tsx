import { Droplets, ShoppingCart, Wrench, Calendar, Bell, Camera, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import RippleButton from './RippleButton';

type ComponentType =
    | 'dashboard'
    | 'marketplace'
    | 'contractors'
    | 'installation-updates'
    | 'image-capture'
    | 'call-scheduling'
    | 'payment'
    | 'installation-scheduling';

interface DashboardHeaderProps {
    unreadNotificationsCount?: number;
    pendingInstallationUpdates?: number;
    onNavigate?: (component: ComponentType) => void;
    useRouterLinks?: boolean;
}

const DashboardHeader = ({
    unreadNotificationsCount = 0,
    pendingInstallationUpdates = 0,
    onNavigate,
    useRouterLinks = true
}: DashboardHeaderProps) => {
    const handleNavigation = (component: ComponentType, routePath?: string) => {
        if (onNavigate) {
            onNavigate(component);
        } else if (useRouterLinks && routePath) {
            // Router navigation will be handled by Link component
        }
    };

    const NavButton = ({
        component,
        routePath,
        children
    }: {
        component: ComponentType;
        routePath?: string;
        children: React.ReactNode;
    }) => {
        if (useRouterLinks && routePath) {
            return (
                <Link to={routePath}>
                    {children}
                </Link>
            );
        }
        return (
            <button onClick={() => handleNavigation(component, routePath)}>
                {children}
            </button>
        );
    };
    return (
        <header className="bg-white/10 backdrop-blur-md border-b border-white/20">
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <div className="w-10 h-10 bg-gradient-water rounded-xl flex items-center justify-center">
                            <Droplets className="w-6 h-6 text-white" />
                        </div>
                        <Link to="/">
                            <div className="flex flex-col">
                                <span className="text-xl font-bold bg-gradient-water bg-clip-text text-transparent">
                                    RAIN
                                </span>
                                <span className="text-xs text-muted-foreground -mt-1">
                                    Responsible Aqua Initiative for Nature
                                </span>
                            </div>
                        </Link>
                    </div>

                    <nav className="hidden md:flex items-center space-x-4">
                        <NavButton component="marketplace" routePath="/marketplace">
                            <RippleButton variant="ghost" size="sm">
                                <ShoppingCart className="w-4 h-4 mr-2" />
                                Marketplace
                            </RippleButton>
                        </NavButton>
                        <NavButton component="contractors" routePath="/contractors">
                            <RippleButton variant="ghost" size="sm">
                                <Wrench className="w-4 h-4 mr-2" />
                                Contractors
                            </RippleButton>
                        </NavButton>
                        <NavButton component="image-capture" routePath="/capture">
                            <RippleButton variant="ghost" size="sm">
                                <Camera className="w-4 h-4 mr-2" />
                                Capture
                            </RippleButton>
                        </NavButton>
                        <NavButton component="installation-updates" routePath="/installation-updates">
                            <div className="relative">
                                <RippleButton variant="ghost" size="sm">
                                    <Calendar className="w-4 h-4 mr-2" />
                                </RippleButton>
                                {/* Show badge if there are pending updates */}
                                {pendingInstallationUpdates > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                                        {pendingInstallationUpdates}
                                    </span>
                                )}
                            </div>
                        </NavButton>
                        <div className="relative">
                            <RippleButton variant="ghost" size="sm">
                                <Bell className="w-4 h-4 mr-2" />
                            </RippleButton>
                            {unreadNotificationsCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                                    {unreadNotificationsCount}
                                </span>
                            )}
                        </div>
                        <Link to="/install-setup">
                            <RippleButton variant="outline" size="sm">
                                <Camera className="w-4 h-4 mr-2" />
                                Install New Setup
                            </RippleButton>
                        </Link>
                        <RippleButton variant="ghost" size="sm">
                            <Settings className="w-4 h-4 mr-2" />
                            Settings
                        </RippleButton>
                    </nav>
                </div>
            </div>
        </header>
    );
};

export default DashboardHeader;