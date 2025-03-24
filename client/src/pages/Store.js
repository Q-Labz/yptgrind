import React, { useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Button,
  TextField,
  InputAdornment,
  Chip,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { motion } from 'framer-motion';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PageHeader from '../components/PageHeader';

const products = [
  {
    id: 1,
    name: 'End Mill - High Speed Steel',
    description: 'Premium quality HSS end mill for general purpose machining',
    price: 49.99,
    image: 'https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?w=800&auto=format&fit=crop&q=60',
    category: 'End Mills',
  },
  {
    id: 2,
    name: 'Carbide Drill Bit Set',
    description: 'Professional grade carbide drill bits for precision drilling',
    price: 129.99,
    image: 'https://images.unsplash.com/photo-1542204165-65bf26472b9b?w=800&auto=format&fit=crop&q=60',
    category: 'Drill Bits',
  },
  {
    id: 3,
    name: 'Threading Tool',
    description: 'High-precision threading tool for accurate thread cutting',
    price: 79.99,
    image: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=800&auto=format&fit=crop&q=60',
    category: 'Threading',
  },
  {
    id: 4,
    name: 'Carbide Insert Pack',
    description: 'High-performance carbide inserts for various cutting applications',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1580901368919-7738efb0f87e?w=800&auto=format&fit=crop&q=60',
    category: 'Inserts',
  },
];

const categories = ['All', 'End Mills', 'Drill Bits', 'Threading', 'Inserts', 'Accessories'];

const ProductCard = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          overflow: 'hidden',
          bgcolor: 'background.paper',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
          },
        }}
      >
        <Box sx={{ position: 'relative', height: 200 }}>
          {!imageLoaded && !imageError && (
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'background.paper',
              }}
            >
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                <Typography variant="body2" color="text.secondary">
                  Loading...
                </Typography>
              </motion.div>
            </Box>
          )}
          <CardMedia
            component="img"
            height="200"
            image={imageError ? 'https://via.placeholder.com/400x200?text=No+Image' : product.image}
            alt={product.name}
            onLoad={handleImageLoad}
            onError={handleImageError}
            sx={{
              objectFit: 'cover',
              transition: 'transform 0.3s ease',
              transform: isHovered ? 'scale(1.1)' : 'scale(1)',
              opacity: imageLoaded ? 1 : 0,
            }}
          />
        </Box>
        <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          <Typography gutterBottom variant="h6" component="h2" sx={{ color: 'text.primary' }}>
            {product.name}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1 }}>
            {product.description}
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" sx={{ color: 'primary.main' }}>
              ${product.price}
            </Typography>
            <Button
              variant="contained"
              startIcon={<ShoppingCartIcon />}
              sx={{
                bgcolor: 'primary.main',
                '&:hover': {
                  bgcolor: 'primary.dark',
                },
              }}
            >
              Add to Cart
            </Button>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const Store = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <Box>
      <PageHeader
        title="Tool Store"
        subtitle="High-Quality Precision Tools for Your Manufacturing Needs"
        image="https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=1600&auto=format&fit=crop&q=80"
      />
      <Container maxWidth={isMobile ? 'sm' : 'xl'} sx={{ py: 8 }}>
        <Box sx={{ mb: 6 }}>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' }, 
            gap: 2, 
            justifyContent: 'center',
            alignItems: 'center',
            mb: 4 
          }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search tools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                ),
                sx: {
                  bgcolor: 'background.paper',
                  '& fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'primary.main',
                  },
                }
              }}
              sx={{ maxWidth: { sm: '300px' } }}
            />
            <Box sx={{ 
              display: 'flex', 
              gap: 1, 
              flexWrap: 'wrap', 
              justifyContent: 'center' 
            }}>
              {categories.map((category) => (
                <Chip
                  key={category}
                  label={category}
                  onClick={() => setSelectedCategory(category)}
                  color={selectedCategory === category ? 'primary' : 'default'}
                  sx={{
                    bgcolor: selectedCategory === category ? 'primary.main' : 'background.paper',
                    '&:hover': {
                      bgcolor: selectedCategory === category ? 'primary.dark' : 'background.paper',
                    },
                  }}
                />
              ))}
            </Box>
          </Box>
        </Box>

        <Grid container spacing={3}>
          {filteredProducts.map((product) => (
            <Grid item key={product.id} xs={12} sm={6} md={4} lg={3}>
              <ProductCard product={product} />
            </Grid>
          ))}
        </Grid>

        {filteredProducts.length === 0 && (
          <Box sx={{ 
            textAlign: 'center', 
            py: 8,
            color: 'text.secondary' 
          }}>
            <Typography variant="h6">
              No products found matching your criteria
            </Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default Store;
