import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, CheckCircle, AlertTriangle, MessageSquare, Phone, User } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import RippleButton from './RippleButton';
import DashboardHeader from './DashboardHeader';

interface InstallationUpdate {
    id: string;
    type: 'date_fixed' | 'on_time' | 'date_change_request' | 'status_update';
    date: string;
    message: string;
    contractorName: string;
    contractorPhone: string;
    status: 'confirmed' | 'pending' | 'delayed' | 'completed';
    scheduledDate?: string;
    requestedNewDate?: string;
    timestamp: string;
}

interface InstallationUpdatesProps {
    includeHeader?: boolean;
}

const InstallationUpdates = ({ includeHeader = false }: InstallationUpdatesProps) => {
    const [updates] = useState<InstallationUpdate[]>([
        {
            id: '1',
            type: 'date_fixed',
            date: '2025-09-25',
            message: 'Installation date has been confirmed for September 25th, 2025. Our team will arrive between 9:00 AM - 11:00 AM.',
            contractorName: 'Rajesh Kumar',
            contractorPhone: '+91 98765 43210',
            status: 'confirmed',
            scheduledDate: '2025-09-25',
            timestamp: '2025-09-20T10:30:00Z'
        },
        {
            id: '2',
            type: 'on_time',
            date: '2025-09-25',
            message: 'Everything is on track for your installation tomorrow. Materials have been prepared and weather conditions are favorable.',
            contractorName: 'Rajesh Kumar',
            contractorPhone: '+91 98765 43210',
            status: 'confirmed',
            scheduledDate: '2025-09-25',
            timestamp: '2025-09-24T16:45:00Z'
        },
        {
            id: '3',
            type: 'date_change_request',
            date: '2025-09-23',
            message: 'Due to unexpected weather conditions, we need to reschedule your installation. We propose September 27th as the new date.',
            contractorName: 'Rajesh Kumar',
            contractorPhone: '+91 98765 43210',
            status: 'pending',
            scheduledDate: '2025-09-25',
            requestedNewDate: '2025-09-27',
            timestamp: '2025-09-23T14:20:00Z'
        }
    ]);

    const getStatusIcon = (type: string, status: string) => {
        switch (type) {
            case 'date_fixed':
                return <Calendar className="w-5 h-5 text-green-500" />;
            case 'on_time':
                return <CheckCircle className="w-5 h-5 text-green-500" />;
            case 'date_change_request':
                return <AlertTriangle className="w-5 h-5 text-orange-500" />;
            default:
                return <Clock className="w-5 h-5 text-blue-500" />;
        }
    };

    const getStatusBadge = (status: string) => {
        const statusConfig = {
            confirmed: { label: 'Confirmed', className: 'bg-green-100 text-green-800' },
            pending: { label: 'Pending Response', className: 'bg-orange-100 text-orange-800' },
            delayed: { label: 'Delayed', className: 'bg-red-100 text-red-800' },
            completed: { label: 'Completed', className: 'bg-blue-100 text-blue-800' }
        };

        const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
        return <Badge className={config.className}>{config.label}</Badge>;
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatTime = (timestamp: string) => {
        return new Date(timestamp).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="min-h-screen bg-gradient-card">
            {includeHeader && (
                <DashboardHeader
                    unreadNotificationsCount={0}
                    pendingInstallationUpdates={1}
                />
            )}
            <div className="container mx-auto max-w-4xl p-6">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-3xl font-bold text-foreground mb-2">Installation Updates</h1>
                    <p className="text-muted-foreground">
                        Track your rainwater harvesting system installation progress and updates
                    </p>
                </motion.div>

                {/* Current Installation Status */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mb-8"
                >
                    <Card className="p-6 bg-gradient-to-r from-primary/10 to-secondary/10">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-semibold mb-2">Current Installation Status</h2>
                                <p className="text-muted-foreground">Scheduled for: {formatDate('2025-09-25')}</p>
                                <p className="text-sm text-muted-foreground mt-1">Time: 9:00 AM - 11:00 AM</p>
                            </div>
                            <div className="text-right">
                                {getStatusBadge('confirmed')}
                                <p className="text-sm text-muted-foreground mt-2">Contractor: Rajesh Kumar</p>
                            </div>
                        </div>
                    </Card>
                </motion.div>

                {/* Updates Timeline */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <h2 className="text-xl font-semibold mb-6">Recent Updates</h2>
                    <div className="space-y-4">
                        {updates.map((update, index) => (
                            <motion.div
                                key={update.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 * (index + 3) }}
                            >
                                <Card className="p-6 hover:shadow-lg transition-shadow">
                                    <div className="flex items-start space-x-4">
                                        <div className="flex-shrink-0 mt-1">
                                            {getStatusIcon(update.type, update.status)}
                                        </div>

                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center space-x-3">
                                                    <h3 className="font-semibold">
                                                        {update.type === 'date_fixed' && 'Installation Date Confirmed'}
                                                        {update.type === 'on_time' && 'On Schedule'}
                                                        {update.type === 'date_change_request' && 'Date Change Request'}
                                                    </h3>
                                                    {getStatusBadge(update.status)}
                                                </div>
                                                <span className="text-sm text-muted-foreground">
                                                    {formatTime(update.timestamp)}
                                                </span>
                                            </div>

                                            <p className="text-muted-foreground mb-4">{update.message}</p>

                                            {/* Date Information */}
                                            <div className="flex flex-wrap gap-4 text-sm">
                                                {update.scheduledDate && (
                                                    <div className="flex items-center space-x-2">
                                                        <Calendar className="w-4 h-4" />
                                                        <span>Scheduled: {formatDate(update.scheduledDate)}</span>
                                                    </div>
                                                )}
                                                {update.requestedNewDate && (
                                                    <div className="flex items-center space-x-2">
                                                        <Calendar className="w-4 h-4 text-orange-500" />
                                                        <span>Requested: {formatDate(update.requestedNewDate)}</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Contractor Info */}
                                            <div className="flex items-center justify-between mt-4 pt-4 border-t">
                                                <div className="flex items-center space-x-2">
                                                    <User className="w-4 h-4" />
                                                    <span className="text-sm font-medium">{update.contractorName}</span>
                                                </div>
                                                <div className="flex space-x-2">
                                                    <RippleButton
                                                        variant="outline"
                                                        size="sm"
                                                        className="flex items-center space-x-1"
                                                    >
                                                        <Phone className="w-4 h-4" />
                                                        <span>Call</span>
                                                    </RippleButton>
                                                    <RippleButton
                                                        variant="outline"
                                                        size="sm"
                                                        className="flex items-center space-x-1"
                                                    >
                                                        <MessageSquare className="w-4 h-4" />
                                                        <span>Message</span>
                                                    </RippleButton>
                                                </div>
                                            </div>

                                            {/* Action for pending requests */}
                                            {update.status === 'pending' && update.type === 'date_change_request' && (
                                                <div className="flex space-x-2 mt-4">
                                                    <RippleButton variant="default" size="sm">
                                                        Accept New Date
                                                    </RippleButton>
                                                    <RippleButton variant="outline" size="sm">
                                                        Keep Original Date
                                                    </RippleButton>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Emergency Contact */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="mt-8"
                >
                    <Card className="p-6 bg-red-50 border-red-200">
                        <h3 className="font-semibold text-red-800 mb-2">Need Immediate Assistance?</h3>
                        <p className="text-red-700 text-sm mb-4">
                            If you have urgent concerns about your installation, contact our support team.
                        </p>
                        <RippleButton variant="default" size="sm">
                            Emergency Contact: +91 1800-RAIN-HELP
                        </RippleButton>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
};

export default InstallationUpdates;