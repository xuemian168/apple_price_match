import React from 'react';
import { useTranslation } from 'next-i18next';
import { motion } from 'framer-motion';
import { 
  Smartphone, 
  Tablet, 
  Laptop, 
  Watch, 
  Headphones,
  Construction
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

interface DevicePlaceholderProps {
  className?: string;
}

const deviceCategories = [
  {
    id: 'iphone',
    icon: Smartphone,
    name: 'iPhone',
    description: 'iPhone 15 series and previous models',
    comingSoon: true,
  },
  {
    id: 'ipad',
    icon: Tablet,
    name: 'iPad',
    description: 'iPad Pro, Air, and standard models',
    comingSoon: true,
  },
  {
    id: 'mac',
    icon: Laptop,
    name: 'Mac',
    description: 'MacBook Pro, Air, iMac, Mac Studio',
    comingSoon: true,
  },
  {
    id: 'watch',
    icon: Watch,
    name: 'Apple Watch',
    description: 'Apple Watch Series and Ultra models',
    comingSoon: true,
  },
  {
    id: 'airpods',
    icon: Headphones,
    name: 'AirPods',
    description: 'AirPods Pro, Max, and standard models',
    comingSoon: true,
  },
];

export function DevicePlaceholder({ className }: DevicePlaceholderProps) {
  const { t } = useTranslation('common');

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <Construction className="h-6 w-6" />
            {t('devices.title')}
          </CardTitle>
          <CardDescription>
            {t('devices.description')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center justify-center w-16 h-16 bg-muted rounded-full"
            >
              <Construction className="h-8 w-8 text-muted-foreground" />
            </motion.div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Coming Soon</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Apple device pricing comparison is currently under development. 
                We're working hard to bring you comprehensive price comparisons 
                for all Apple devices across different countries.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Device Categories Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Device Categories</CardTitle>
          <CardDescription>
            These device categories will be available soon
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="iphone" className="w-full">
            <TabsList className="grid w-full grid-cols-3 lg:grid-cols-5">
              {deviceCategories.map((category) => (
                <TabsTrigger 
                  key={category.id} 
                  value={category.id}
                  className="text-xs"
                >
                  <category.icon className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">{category.name}</span>
                </TabsTrigger>
              ))}
            </TabsList>
            
            {deviceCategories.map((category, index) => (
              <TabsContent key={category.id} value={category.id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-4">
                        <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg">
                          <category.icon className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1 space-y-2">
                          <h4 className="font-semibold">{category.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {category.description}
                          </p>
                          <div className="flex items-center gap-2">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                              Coming Soon
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* Features Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Planned Features</CardTitle>
          <CardDescription>
            What to expect when device pricing becomes available
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                title: 'Multi-Country Comparison',
                description: 'Compare prices across all Apple stores worldwide',
              },
              {
                title: 'Real-time Exchange Rates',
                description: 'Accurate currency conversion with live exchange rates',
              },
              {
                title: 'Configuration Options',
                description: 'Compare different storage, color, and feature options',
              },
              {
                title: 'Price History',
                description: 'Track price changes over time for better buying decisions',
              },
              {
                title: 'Deal Alerts',
                description: 'Get notified when prices drop in your preferred countries',
              },
              {
                title: 'Export & Share',
                description: 'Export comparison data or share findings with others',
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="p-4 border rounded-lg"
              >
                <h5 className="font-medium mb-1">{feature.title}</h5>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* CTA */}
      <Card>
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <h3 className="text-lg font-semibold">Stay Updated</h3>
            <p className="text-muted-foreground">
              Want to be notified when device pricing becomes available?
            </p>
            <Button disabled className="cursor-not-allowed">
              Notify Me (Coming Soon)
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}