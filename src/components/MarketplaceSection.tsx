import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Filter, Star, Ruler, DollarSign } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import RippleButton from './RippleButton';

interface MarketplaceSectionProps {
  onComplete?: () => void;
}

const MarketplaceSection = ({ onComplete }: MarketplaceSectionProps) => {
  const [priceRange, setPriceRange] = useState([1000, 50000]);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const products = [
    {
      id: 1,
      name: 'Premium Water Tank 5000L',
      price: 25000,
      rating: 4.8,
      dimensions: '2.2m × 2.2m × 2.1m',
      category: 'tanks',
      image: '/api/placeholder/300/200',
      description: 'Heavy-duty polyethylene tank with UV protection',
      features: ['UV Resistant', 'Food Grade', '10 Year Warranty']
    },
    {
      id: 2,
      name: 'Gutter Collection System',
      price: 8500,
      rating: 4.6,
      dimensions: '0.15m × 6m × 0.1m',
      category: 'gutters',
      image: '/api/placeholder/300/200',
      description: 'Complete aluminum guttering with leaf guards',
      features: ['Corrosion Resistant', 'Easy Install', 'Leaf Guard Included']
    },
    {
      id: 3,
      name: 'Smart Water Filter Pro',
      price: 15000,
      rating: 4.9,
      dimensions: '0.8m × 0.6m × 1.2m',
      category: 'filters',
      image: '/api/placeholder/300/200',
      description: 'Multi-stage filtration with IoT monitoring',
      features: ['Smart Monitoring', '5-Stage Filter', 'Auto Clean']
    },
    {
      id: 4,
      name: 'Compact Tank 2000L',
      price: 12000,
      rating: 4.7,
      dimensions: '1.5m × 1.5m × 1.8m',
      category: 'tanks',
      image: '/api/placeholder/300/200',
      description: 'Space-efficient design for smaller rooftops',
      features: ['Space Saver', 'Stackable', 'Quick Connect']
    }
  ];

  const categories = [
    { id: 'all', name: 'All Products' },
    { id: 'tanks', name: 'Water Tanks' },
    { id: 'gutters', name: 'Gutters' },
    { id: 'filters', name: 'Filters' },
    { id: 'pumps', name: 'Pumps' }
  ];

  const filteredProducts = products.filter(product => {
    const inPriceRange = product.price >= priceRange[0] && product.price <= priceRange[1];
    const inCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return inPriceRange && inCategory;
  });

  return (
    <section id="marketplace" className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-eco bg-clip-text text-transparent">
              Marketplace
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose from our curated selection of rainwater harvesting components, 
            all verified to fit your analyzed space requirements.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="lg:col-span-1"
          >
            <Card className="p-6 glass border-white/20 shadow-glass sticky top-24">
              <div className="flex items-center mb-6">
                <Filter className="w-5 h-5 mr-2" />
                <h3 className="text-lg font-semibold">Filters</h3>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">Categories</h4>
                <div className="space-y-2">
                  {categories.map(category => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        selectedCategory === category.id
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-muted'
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h4 className="font-medium mb-3">Price Range</h4>
                <div className="px-2">
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    max={50000}
                    min={1000}
                    step={1000}
                    className="mb-4"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>₹{priceRange[0].toLocaleString()}</span>
                    <span>₹{priceRange[1].toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="group"
                >
                  <Card className="overflow-hidden glass border-white/20 shadow-glass hover:shadow-water transition-all duration-300">
                    <div className="relative h-48 bg-gradient-card">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20" />
                      <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                        <div className="flex items-center text-sm">
                          <Star className="w-4 h-4 text-yellow-400 mr-1 fill-current" />
                          <span className="text-white font-medium">{product.rating}</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-6">
                      <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        {product.description}
                      </p>

                      {/* Features */}
                      <div className="flex flex-wrap gap-1 mb-4">
                        {product.features.map(feature => (
                          <span
                            key={feature}
                            className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>

                      {/* Dimensions */}
                      <div className="flex items-center mb-4 text-sm text-muted-foreground">
                        <Ruler className="w-4 h-4 mr-2" />
                        <span>{product.dimensions}</span>
                      </div>

                      {/* Price */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <DollarSign className="w-5 h-5 text-secondary mr-1" />
                          <span className="text-2xl font-bold">₹{product.price.toLocaleString()}</span>
                        </div>
                      </div>

              <RippleButton 
                variant="outline" 
                className="w-full group-hover:variant-hero transition-all duration-300"
                onClick={() => onComplete?.()}
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Add to Cart
              </RippleButton>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <ShoppingCart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No products found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your filters to see more products
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MarketplaceSection;