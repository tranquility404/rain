import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Droplets, Trophy, Users, TrendingUp, Calendar, Gift, Camera, ShoppingCart, Phone, CreditCard, Settings, Bell, Wrench } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import InteractiveMap from './InteractiveMap';
import RippleButton from './RippleButton';
import DashboardHeader from './DashboardHeader';

interface DashboardProps {
  includeHeader?: boolean;
}

const Dashboard = ({ includeHeader = false }: DashboardProps) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [notifications] = useState([
    { id: 1, title: 'Maintenance Due', message: 'System maintenance scheduled for tomorrow', read: false },
    { id: 2, title: 'Water Level Alert', message: 'Tank level dropped below 20%', read: false },
    { id: 3, title: 'Community Event', message: 'Water conservation meetup this Friday', read: true },
    { id: 4, title: 'Reward Points', message: 'You earned 50 points for water savings!', read: false }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const nearbySetups = [
    { id: 1, address: 'MG Road, 0.5km', capacity: '15,000L', savings: '₹12,500', lat: 12.9716, lng: 77.5946, efficiency: 92, status: 'installed' as const, connections: [2], houses: [] },
    { id: 2, address: 'Brigade Road, 0.8km', capacity: '20,000L', savings: '₹18,200', lat: 12.9725, lng: 77.6088, efficiency: 88, status: 'potential_hub' as const, connections: [1, 3], houses: [] },
    { id: 3, address: 'Koramangala, 1.2km', capacity: '12,000L', savings: '₹9,800', lat: 12.9352, lng: 77.6245, efficiency: 85, status: 'installed' as const, connections: [2], houses: [] },
    { id: 4, address: 'Indiranagar, 1.5km', capacity: '18,000L', savings: '₹15,600', lat: 12.9719, lng: 77.6412, efficiency: 90, status: 'expanding' as const, connections: [1], houses: [] }
  ];

  const leaderboard = [
    { rank: 1, name: 'Green Villa Society', waterSaved: '50,000L', moneySaved: '₹45,000', points: 950 },
    { rank: 2, name: 'Eco Heights Apartments', waterSaved: '45,000L', moneySaved: '₹38,500', points: 890 },
    { rank: 3, name: 'Your House', waterSaved: '35,000L', moneySaved: '₹28,200', points: 720 },
    { rank: 4, name: 'Sunshine Residency', waterSaved: '32,000L', moneySaved: '₹25,800', points: 680 },
    { rank: 5, name: 'Rainbow Homes', waterSaved: '28,000L', moneySaved: '₹22,400', points: 620 }
  ];

  const stats = {
    totalWaterSaved: '35,000L',
    moneySaved: '₹28,200',
    points: 720,
    rank: 3,
    tankLevel: 85,
    lastRainfall: '2 days ago',
    nextMaintenanceIn: '15 days'
  };

  return (
    <div className="min-h-screen bg-gradient-card">
      {/* Header with Navigation */}
      {/* {includeHeader && (
        <DashboardHeader
          unreadNotificationsCount={unreadCount}
          pendingInstallationUpdates={1}
        />
      )} */}

      <section className="py-20">
        <div className="container mx-auto px-4">
          {/* Welcome Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-left mb-8"
          >
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
              Welcome <span className="bg-gradient-water bg-clip-text text-transparent">Tranquility</span>,
            </h1>
            <p className="text-muted-foreground">
              Ready to continue your water conservation journey?
            </p>
          </motion.div>

          {/* Tab Navigation */}
          <div className="flex justify-center mb-8">
            <div className="bg-white/10 rounded-xl p-1 inline-flex">
              {[
                { id: 'overview', label: 'Overview', icon: TrendingUp },
                { id: 'map', label: 'Nearby Setups', icon: MapPin },
                { id: 'leaderboard', label: 'Leaderboard', icon: Trophy }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-all duration-300 ${activeTab === tab.id
                    ? 'bg-primary text-primary-foreground shadow-lg'
                    : 'text-card-foreground hover:bg-white/10'
                    }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Stats Cards */}
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card className="p-6 glass border-white/20 shadow-glass text-center">
                  <div className="w-12 h-12 bg-gradient-water rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Droplets className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-card-foreground mb-1">{stats.totalWaterSaved}</h3>
                  <p className="text-muted-foreground text-sm">Total Water Saved</p>
                </Card>

                <Card className="p-6 glass border-white/20 shadow-glass text-center">
                  <div className="w-12 h-12 bg-gradient-eco rounded-xl flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-card-foreground mb-1">{stats.moneySaved}</h3>
                  <p className="text-muted-foreground text-sm">Money Saved</p>
                </Card>

                <Card className="p-6 glass border-white/20 shadow-glass text-center">
                  <div className="w-12 h-12 bg-gradient-hero rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Trophy className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-card-foreground mb-1">#{stats.rank}</h3>
                  <p className="text-muted-foreground text-sm">Community Rank</p>
                </Card>

                <Card className="p-6 glass border-white/20 shadow-glass text-center">
                  <div className="w-12 h-12 bg-gradient-water rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Gift className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-card-foreground mb-1">{stats.points}</h3>
                  <p className="text-muted-foreground text-sm">Reward Points</p>
                </Card>
              </div>

              {/* Tank Level & Recent Activity */}
              <div className="grid md:grid-cols-2 gap-8">
                <Card className="p-6 glass border-white/20 shadow-glass">
                  <h3 className="text-lg font-semibold mb-4 text-card-foreground">Current Tank Level</h3>
                  <div className="relative">
                    <div className="w-full bg-muted/30 rounded-full h-6">
                      <motion.div
                        className="bg-gradient-water h-6 rounded-full flex items-center justify-end pr-2"
                        initial={{ width: 0 }}
                        animate={{ width: `${stats.tankLevel}%` }}
                        transition={{ duration: 1.5, ease: 'easeOut' }}
                      >
                        <span className="text-white text-sm font-medium">{stats.tankLevel}%</span>
                      </motion.div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      Last rainfall: {stats.lastRainfall}
                    </p>
                  </div>
                </Card>

                <Card className="p-6 glass border-white/20 shadow-glass">
                  <h3 className="text-lg font-semibold mb-4 text-card-foreground">Upcoming Events</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-medium text-card-foreground">System Maintenance</p>
                        <p className="text-sm text-muted-foreground">Due in {stats.nextMaintenanceIn}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Users className="w-5 h-5 text-secondary" />
                      <div>
                        <p className="font-medium text-card-foreground">Community Meetup</p>
                        <p className="text-sm text-muted-foreground">Next Friday, 6 PM</p>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </motion.div>
          )}

          {/* Map Tab */}
          {activeTab === 'map' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Interactive Map */}
              <InteractiveMap nearbySetups={nearbySetups} />
            </motion.div>
          )}

          {/* Leaderboard Tab */}
          {activeTab === 'leaderboard' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl mx-auto"
            >
              <Card className="p-6 glass border-white/20 shadow-glass">
                <h3 className="text-xl font-semibold mb-6 text-card-foreground">Community Leaderboard</h3>
                <div className="space-y-4">
                  {leaderboard.map((entry, index) => (
                    <motion.div
                      key={entry.rank}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`p-4 rounded-lg flex items-center justify-between ${entry.name === 'Your House'
                        ? 'bg-primary/10 border border-primary/30'
                        : 'bg-gradient-card/30'
                        }`}
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${entry.rank === 1 ? 'bg-yellow-500 text-white' :
                          entry.rank === 2 ? 'bg-gray-400 text-white' :
                            entry.rank === 3 ? 'bg-amber-600 text-white' :
                              'bg-gradient-water text-white'
                          }`}>
                          {entry.rank}
                        </div>
                        <div>
                          <p className="font-semibold text-card-foreground">{entry.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {entry.waterSaved} • {entry.moneySaved}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-primary">{entry.points} pts</p>
                        {entry.name === 'Your House' && (
                          <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">
                            You
                          </span>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;