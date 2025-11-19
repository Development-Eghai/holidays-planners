// src/pages/admin/modules/QuotationManagement/components/QuotationPDFTemplates.jsx
// FIXED VERSION: Added page-break controls to prevent content splitting
import React from 'react';
import { Box, Typography, Divider, Grid, Table, TableBody, TableCell, TableHead, TableRow, Avatar } from '@mui/material';
import { Email, Phone, Language, LocationOn, AccountBalance, CreditCard } from '@mui/icons-material';

// --- Helper to get image URL safely ---
const getImageUrl = (quotation, fieldName) => {
  // Check top-level first (since we now save it there)
  let url = quotation[fieldName];
  
  // Fallback to nested trip object
  if (!url && quotation.trip) {
    url = quotation.trip[fieldName];
  }

  // Handle gallery images which is an array
  if (fieldName === 'gallery_images' && Array.isArray(url)) {
      // Ensure only valid strings are returned
      return url.filter(img => typeof img === 'string' && img.length > 0);
  }

  return url || '';
};

// Modern Professional Template - Enhanced Version (Includes Hero/Gallery Images)
export const ModernProfessionalTemplate = ({ quotation }) => {
  const { 
    client_name, client_email, client_mobile, display_title, overview, 
    itinerary, costing, policies, payment, company, __client_name, 
    __client_email, __client_mobile
  } = quotation;

  const finalClientName = __client_name || client_name || 'Valued Customer';
  const finalClientEmail = __client_email || client_email || '';
  const finalClientMobile = __client_mobile || client_mobile || '';
  const heroImage = getImageUrl(quotation, 'hero_image');
  const galleryImages = getImageUrl(quotation, 'gallery_images');
  
  return (
    <Box sx={{ 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh',
      p: 0
    }}>
      {/* Header Section */}
      <Box sx={{ 
        background: 'rgba(255,255,255,0.98)', 
        p: 4, 
        borderBottom: '5px solid #667eea',
        pageBreakInside: 'avoid',
        breakInside: 'avoid'
      }}>
        <Grid container alignItems="center" spacing={2}>
          <Grid item xs={8}>
            <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#667eea', mb: 1 }}>
              {company?.name || 'Holidays Planners'}
            </Typography>
            <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', mt: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Email fontSize="small" sx={{ color: '#666' }} />
                <Typography variant="body2" color="text.secondary">{company?.email}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Phone fontSize="small" sx={{ color: '#666' }} />
                <Typography variant="body2" color="text.secondary">{company?.mobile}</Typography>
              </Box>
              {company?.website && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Language fontSize="small" sx={{ color: '#666' }} />
                  <Typography variant="body2" color="text.secondary">{company.website}</Typography>
                </Box>
              )}
            </Box>
          </Grid>
          <Grid item xs={4} sx={{ textAlign: 'right' }}>
            {company?.logo_url && (
              <img src={company.logo_url} alt="Company Logo" style={{ maxWidth: '120px', maxHeight: '80px' }} />
            )}
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ p: 4 }}>

        {/* Hero Image Section */}
        {heroImage && (
          <Box sx={{ 
            mb: 4, 
            borderRadius: 3, 
            overflow: 'hidden', 
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
            pageBreakInside: 'avoid',
            breakInside: 'avoid'
          }}>
            <img 
              src={heroImage} 
              alt="Trip Hero" 
              style={{ width: '100%', height: '300px', objectFit: 'cover' }}
            />
          </Box>
        )}

        {/* Client Info Card */}
        <Box sx={{ 
          bgcolor: 'rgba(255,255,255,0.98)', 
          p: 4, 
          borderRadius: 3, 
          mb: 4,
          boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
          border: '1px solid rgba(102, 126, 234, 0.2)',
          pageBreakInside: 'avoid',
          breakInside: 'avoid'
        }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#667eea', mb: 1 }}>
            {display_title || 'Travel Quotation'}
          </Typography>
          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
            Quotation ID: <Typography component="span" fontWeight="bold" color="primary">#{quotation.id || 'DRAFT'}</Typography>
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
                Prepared For
              </Typography>
              <Typography variant="h6" fontWeight="bold">{finalClientName}</Typography>
              {finalClientEmail && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                  <Email fontSize="small" color="action" />
                  <Typography variant="body2">{finalClientEmail}</Typography>
                </Box>
              )}
              {finalClientMobile && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                  <Phone fontSize="small" color="action" />
                  <Typography variant="body2">{finalClientMobile}</Typography>
                </Box>
              )}
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
                Quotation Date
              </Typography>
              <Typography variant="body1" fontWeight="medium">
                {new Date(quotation.date || Date.now()).toLocaleDateString('en-IN', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </Typography>
            </Grid>
          </Grid>
        </Box>

        {/* Trip Details */}
        <Box sx={{ 
          bgcolor: 'rgba(255,255,255,0.98)', 
          p: 4, 
          borderRadius: 3, 
          mb: 4, 
          boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
          pageBreakInside: 'avoid',
          breakInside: 'avoid'
        }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3, color: '#764ba2', borderBottom: '3px solid #764ba2', pb: 1 }}>
            Overview
          </Typography>
          <Typography variant="body1" sx={{ lineHeight: 2, color: '#555', whiteSpace: 'pre-line' }}>
            {overview || 'Your personalized travel experience awaits.'}
          </Typography>
        </Box>

        {/* Gallery Images */}
        {galleryImages && galleryImages.length > 0 && (
          <Box sx={{ 
            bgcolor: 'rgba(255,255,255,0.98)', 
            p: 4, 
            borderRadius: 3, 
            mb: 4, 
            boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
            pageBreakInside: 'avoid',
            breakInside: 'avoid'
          }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3, color: '#667eea', borderBottom: '3px solid #667eea', pb: 1 }}>
              🌄 Gallery
            </Typography>
            <Grid container spacing={2}>
              {galleryImages.slice(0, 6).map((img, idx) => (
                <Grid item xs={4} key={idx}>
                  <img 
                    src={img} 
                    alt={`Gallery Image ${idx + 1}`} 
                    style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '8px' }}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* Itinerary - FIXED: Added page-break controls */}
        {itinerary && itinerary.length > 0 && (
          <Box sx={{ bgcolor: 'rgba(255,255,255,0.98)', p: 4, borderRadius: 3, mb: 4, boxShadow: '0 8px 32px rgba(0,0,0,0.15)' }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3, color: '#667eea', borderBottom: '3px solid #667eea', pb: 1 }}>
              📅 Day-wise Itinerary
            </Typography>
            {itinerary.map((day, idx) => (
              <Box 
                key={idx} 
                sx={{ 
                  mb: 2.5, 
                  p: 2.5, 
                  bgcolor: idx % 2 === 0 ? '#f8f9ff' : '#fff5f8', 
                  borderRadius: 2,
                  borderLeft: '4px solid',
                  borderColor: idx % 2 === 0 ? '#667eea' : '#764ba2',
                  // CRITICAL FIX: Prevent boxes from splitting across pages
                  pageBreakInside: 'avoid',
                  breakInside: 'avoid'
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333', mb: 1 }}>
                  Day {day.day}: {day.title}
                </Typography>
                <Typography variant="body2" sx={{ color: '#666', lineHeight: 1.8, whiteSpace: 'pre-line' }}>
                  {day.description}
                </Typography>
              </Box>
            ))}
          </Box>
        )}

        {/* Costing */}
        <Box sx={{ 
          bgcolor: 'rgba(255,255,255,0.98)', 
          p: 4, 
          borderRadius: 3, 
          mb: 4, 
          boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
          pageBreakInside: 'avoid',
          breakInside: 'avoid'
        }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3, color: '#667eea', borderBottom: '3px solid #667eea', pb: 1 }}>
            💰 Investment Details
          </Typography>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', border: '1px solid #4a148c' }}>
                <TableCell sx={{ color: '#fff', fontWeight: 'bold', fontSize: '0.95rem', borderRight: '1px solid rgba(255,255,255,0.3)' }}>Item</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 'bold', fontSize: '0.95rem', borderRight: '1px solid rgba(255,255,255,0.3)' }} align="center">Qty</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 'bold', fontSize: '0.95rem', borderRight: '1px solid rgba(255,255,255,0.3)' }} align="right">Unit Price</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 'bold', fontSize: '0.95rem' }} align="right">Total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {costing?.items?.map((item, idx) => (
                <TableRow key={idx} sx={{ '&:nth-of-type(odd)': { bgcolor: '#f9f9ff' } }}>
                  <TableCell sx={{ fontWeight: 'medium' }}>{item.name}</TableCell>
                  <TableCell align="center">{item.quantity}</TableCell>
                  <TableCell align="right">₹{item.unit_price?.toLocaleString('en-IN')}</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                    ₹{(item.quantity * item.unit_price)?.toLocaleString('en-IN')}
                  </TableCell>
                </TableRow>
              ))}
              <TableRow sx={{ bgcolor: '#4a148c' }}>
                <TableCell colSpan={3} sx={{ fontWeight: 'bold', fontSize: '1.2rem', color: '#fff', borderRight: '1px solid rgba(255,255,255,0.3)' }}>
                  GRAND TOTAL
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '1.3rem', color: '#fff' }}>
                  ₹{costing?.total_amount?.toLocaleString('en-IN')}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Box>

        {/* Policies */}
        <Box sx={{ 
          bgcolor: 'rgba(255,255,255,0.98)', 
          p: 4, 
          borderRadius: 3, 
          mb: 4, 
          boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
          pageBreakInside: 'avoid',
          breakInside: 'avoid'
        }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3, color: '#764ba2', borderBottom: '3px solid #764ba2', pb: 1 }}>
            📋 Terms & Policies
          </Typography>
          {policies?.payment_terms && (
            <>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 2, mb: 1, color: '#667eea' }}>
                Payment Terms
              </Typography>
              <Typography variant="body2" sx={{ lineHeight: 1.8, color: '#555', whiteSpace: 'pre-line' }}>
                {policies.payment_terms}
              </Typography>
            </>
          )}
          {policies?.cancellation_policy && (
            <>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 3, mb: 1, color: '#667eea' }}>
                Cancellation Policy
              </Typography>
              <Typography variant="body2" sx={{ lineHeight: 1.8, color: '#555', whiteSpace: 'pre-line' }}>
                {policies.cancellation_policy}
              </Typography>
            </>
          )}
          {policies?.terms_and_conditions && (
            <>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 3, mb: 1, color: '#667eea' }}>
                Terms & Conditions
              </Typography>
              <Typography variant="body2" sx={{ lineHeight: 1.8, color: '#555', whiteSpace: 'pre-line' }}>
                {policies.terms_and_conditions}
              </Typography>
            </>
          )}
        </Box>

        {/* Payment Details */}
        <Box sx={{ 
          bgcolor: 'rgba(255,255,255,0.98)', 
          p: 4, 
          borderRadius: 3, 
          boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
          pageBreakInside: 'avoid',
          breakInside: 'avoid'
        }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3, color: '#667eea', borderBottom: '3px solid #667eea', pb: 1 }}>
            💳 Payment Information
          </Typography>
          <Grid container spacing={4}>
            {payment?.bank_name && (
              <Grid item xs={6} md={4}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                  <AccountBalance fontSize="small" color="action" />
                  <Typography variant="caption" color="text.secondary">Bank Name</Typography>
                </Box>
                <Typography variant="body1" fontWeight="medium">{payment.bank_name}</Typography>
              </Grid>
            )}
            {payment?.account_number && (
              <Grid item xs={6} md={4}>
                <Typography variant="caption" color="text.secondary">Account Number</Typography>
                <Typography variant="body1" fontWeight="medium">{payment.account_number}</Typography>
              </Grid>
            )}
            {payment?.ifsc_code && (
              <Grid item xs={6} md={4}>
                <Typography variant="caption" color="text.secondary">IFSC Code</Typography>
                <Typography variant="body1" fontWeight="medium">{payment.ifsc_code}</Typography>
              </Grid>
            )}
            {payment?.branch_name && (
              <Grid item xs={6} md={4}>
                <Typography variant="caption" color="text.secondary">Branch</Typography>
                <Typography variant="body1" fontWeight="medium">{payment.branch_name}</Typography>
              </Grid>
            )}
            {payment?.gst_number && (
              <Grid item xs={6} md={4}>
                <Typography variant="caption" color="text.secondary">GST Number</Typography>
                <Typography variant="body1" fontWeight="medium">{payment.gst_number}</Typography>
              </Grid>
            )}
            {payment?.upi_ids?.[0] && (
              <Grid item xs={6} md={4}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                  <CreditCard fontSize="small" color="action" />
                  <Typography variant="caption" color="text.secondary">UPI ID</Typography>
                </Box>
                <Typography variant="body1" fontWeight="medium">{payment.upi_ids[0]}</Typography>
              </Grid>
            )}
          </Grid>

          {payment?.qr_code_url && (
            <Box sx={{ mt: 4, textAlign: 'center', p: 3, bgcolor: '#f9f9ff', borderRadius: 2 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                Scan to Pay
              </Typography>
              <img 
                src={payment.qr_code_url} 
                alt="Payment QR Code" 
                style={{ maxWidth: '200px', maxHeight: '200px', marginBottom: '16px', border: '2px solid #667eea', borderRadius: '8px' }}
              />
            </Box>
          )}
        </Box>
      </Box>

      {/* Footer */}
      <Box sx={{ 
        bgcolor: 'rgba(0,0,0,0.8)', 
        color: '#fff', 
        p: 3, 
        textAlign: 'center', 
        mt: 4,
        pageBreakInside: 'avoid',
        breakInside: 'avoid'
      }}>
        <Typography variant="body2">
          Thank you for choosing {company?.name || 'Holidays Planners'}. We look forward to making your journey memorable!
        </Typography>
        <Typography variant="caption" sx={{ mt: 1, display: 'block', opacity: 0.7 }}>
          For any queries, feel free to contact us at {company?.email} or {company?.mobile}
        </Typography>
      </Box>
    </Box>
  );
};

// Luxury Gold Template - Enhanced (Includes Hero/Gallery Images)
export const LuxuryGoldTemplate = ({ quotation }) => {
  const { 
    client_name, client_email, client_mobile, display_title, overview, 
    itinerary, costing, policies, payment, company, __client_name, 
    __client_email, __client_mobile
  } = quotation;

  const finalClientName = __client_name || client_name || 'Distinguished Guest';
  const finalClientEmail = __client_email || client_email || '';
  const finalClientMobile = __client_mobile || client_mobile || '';
  const heroImage = getImageUrl(quotation, 'hero_image');
  const galleryImages = getImageUrl(quotation, 'gallery_images');
  
  return (
    <Box sx={{ 
      background: '#fff',
      minHeight: '100vh',
      p: 4
    }}>
      {/* Elegant Header */}
      <Box sx={{ 
        textAlign: 'center', 
        mb: 5, 
        pb: 3, 
        borderBottom: '5px solid #D4AF37',
        background: 'linear-gradient(90deg, #FFF8DC 0%, #FAEBD7 100%)',
        p: 3,
        borderRadius: 2,
        pageBreakInside: 'avoid',
        breakInside: 'avoid'
      }}>
        <Typography variant="h2" sx={{ 
          fontWeight: 'bold', 
          color: '#8B4513', 
          textShadow: '1px 1px 3px rgba(212,175,55,0.5)',
          fontFamily: 'Georgia, serif',
          mb: 1
        }}>
          ✨ {company?.name || 'Luxury Holidays Planners'} ✨
        </Typography>
        <Typography variant="h6" sx={{ color: '#D4AF37', fontStyle: 'italic', mt: 2, fontWeight: 'bold' }}>
          Crafting Premium Travel Experiences
        </Typography>
      </Box>

      {/* Hero Image Section */}
      {heroImage && (
        <Box sx={{ 
          mb: 4, 
          borderRadius: 4, 
          overflow: 'hidden', 
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          pageBreakInside: 'avoid',
          breakInside: 'avoid'
        }}>
          <img 
            src={heroImage} 
            alt="Trip Hero" 
            style={{ width: '100%', height: '350px', objectFit: 'cover' }}
          />
        </Box>
      )}

      {/* Client Greeting Card */}
      <Box sx={{ 
        bgcolor: '#fff', 
        p: 5, 
        borderRadius: 4, 
        boxShadow: '0 15px 50px rgba(0,0,0,0.1)', 
        mb: 4,
        border: '2px solid #D4AF37',
        pageBreakInside: 'avoid',
        breakInside: 'avoid'
      }}>
        <Typography variant="h3" sx={{ 
          fontWeight: 'bold', 
          color: '#D4AF37', 
          mb: 3, 
          fontFamily: 'Georgia, serif',
          borderBottom: '3px solid #D4AF37', 
          pb: 2 
        }}>
          {display_title || 'Exclusive Travel Quotation'}
        </Typography>
        <Typography variant="body1" sx={{ lineHeight: 2, fontSize: '1.1rem', color: '#555', mb: 3 }}>
          Dear {finalClientName}, we are absolutely delighted to present you with an exclusive, tailor-made travel experience 
          designed to exceed your expectations. Your journey of a lifetime awaits.
        </Typography>
        
        <Grid container spacing={2} sx={{ mt: 3, p: 2, bgcolor: '#FFF8DC', borderRadius: 2 }}>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Email sx={{ color: '#D4AF37' }} />
              <Box>
                <Typography variant="caption" color="text.secondary">Email</Typography>
                <Typography variant="body2" fontWeight="medium">{finalClientEmail || 'N/A'}</Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Phone sx={{ color: '#D4AF37' }} />
              <Box>
                <Typography variant="caption" color="text.secondary">Mobile</Typography>
                <Typography variant="body2" fontWeight="medium">{finalClientMobile || 'N/A'}</Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Package Details */}
      <Box sx={{ 
        bgcolor: '#fff', 
        p: 5, 
        borderRadius: 4, 
        boxShadow: '0 15px 50px rgba(0,0,0,0.1)', 
        mb: 4,
        pageBreakInside: 'avoid',
        breakInside: 'avoid'
      }}>
        <Typography variant="h4" sx={{ 
          fontWeight: 'bold', 
          color: '#8B4513', 
          mb: 3,
          fontFamily: 'Georgia, serif'
        }}>
          ✨ Package Overview
        </Typography>
        <Divider sx={{ mb: 3, borderColor: '#D4AF37', borderWidth: 2 }} />
        <Typography variant="body1" sx={{ lineHeight: 2, fontSize: '1.05rem', whiteSpace: 'pre-line' }}>
          {overview || 'An unforgettable journey awaits you.'}
        </Typography>
      </Box>

      {/* Gallery Images */}
      {galleryImages && galleryImages.length > 0 && (
          <Box sx={{ 
            bgcolor: '#fff', 
            p: 4, 
            borderRadius: 4, 
            mb: 4, 
            boxShadow: '0 15px 50px rgba(0,0,0,0.1)', 
            border: '1px solid #D4AF37',
            pageBreakInside: 'avoid',
            breakInside: 'avoid'
          }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3, color: '#D4AF37', borderBottom: '3px solid #D4AF37', pb: 1 }}>
              📸 Moments to Come
            </Typography>
            <Grid container spacing={2}>
              {galleryImages.slice(0, 6).map((img, idx) => (
                <Grid item xs={4} key={idx}>
                  <img 
                    src={img} 
                    alt={`Gallery Image ${idx + 1}`} 
                    style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '8px' }}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
      )}

      {/* Luxury Itinerary - FIXED: Added page-break controls and reduced spacing */}
      {itinerary && itinerary.length > 0 && (
        <Box sx={{ bgcolor: '#fff', p: 5, borderRadius: 4, boxShadow: '0 15px 50px rgba(0,0,0,0.1)', mb: 4 }}>
          <Typography variant="h4" sx={{ 
            fontWeight: 'bold', 
            color: '#D4AF37', 
            mb: 4,
            fontFamily: 'Georgia, serif',
            borderBottom: '3px solid #D4AF37',
            pb: 2
          }}>
            🗓️ Your Journey, Day by Day
          </Typography>
          {itinerary.map((day, idx) => (
            <Box key={idx} sx={{ 
              mb: 2,
              p: 3, 
              bgcolor: '#FFF8DC', 
              borderRadius: 3,
              borderLeft: '5px solid #D4AF37',
              boxShadow: '0 4px 15px rgba(212,175,55,0.2)',
              // CRITICAL FIX: Prevent boxes from splitting across pages
              pageBreakInside: 'avoid',
              breakInside: 'avoid'
            }}>
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#8B4513', mb: 1 }}>
                Day {day.day} • {day.title}
              </Typography>
              <Typography variant="body1" sx={{ lineHeight: 1.9, color: '#666', whiteSpace: 'pre-line' }}>
                {day.description}
              </Typography>
            </Box>
          ))}
        </Box>
      )}

      {/* Investment Section */}
      <Box sx={{ 
        bgcolor: '#fff', 
        p: 5, 
        borderRadius: 4, 
        boxShadow: '0 15px 50px rgba(0,0,0,0.1)', 
        mb: 4,
        pageBreakInside: 'avoid',
        breakInside: 'avoid'
      }}>
        <Typography variant="h4" sx={{ 
          fontWeight: 'bold', 
          color: '#D4AF37', 
          mb: 4,
          fontFamily: 'Georgia, serif'
        }}>
          💎 Investment Details
        </Typography>
        <Box sx={{ bgcolor: '#FFF8DC', p: 4, borderRadius: 3 }}>
          {costing?.items?.map((item, idx) => (
            <Box key={idx} sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              mb: 3, 
              pb: 2, 
              borderBottom: '2px dashed #D4AF37',
              alignItems: 'center'
            }}>
              <Box>
                <Typography variant="h6" fontWeight="medium">{item.name}</Typography>
                <Typography variant="caption" color="text.secondary">
                  Quantity: {item.quantity} × ₹{item.unit_price?.toLocaleString('en-IN')}
                </Typography>
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#8B4513' }}>
                ₹{(item.quantity * item.unit_price)?.toLocaleString('en-IN')}
              </Typography>
            </Box>
          ))}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            mt: 4, 
            pt: 3, 
            borderTop: '4px solid #D4AF37',
            alignItems: 'center'
          }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#8B4513', fontFamily: 'Georgia, serif' }}>
              TOTAL INVESTMENT
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#D4AF37', fontFamily: 'Georgia, serif' }}>
              ₹{costing?.total_amount?.toLocaleString('en-IN')}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Policies */}
      <Box sx={{ 
        bgcolor: '#fff', 
        p: 5, 
        borderRadius: 4, 
        boxShadow: '0 15px 50px rgba(0,0,0,0.1)', 
        mb: 4,
        pageBreakInside: 'avoid',
        breakInside: 'avoid'
      }}>
        <Typography variant="h4" sx={{ 
          fontWeight: 'bold', 
          color: '#8B4513', 
          mb: 4,
          fontFamily: 'Georgia, serif'
        }}>
          📜 Important Guidelines
        </Typography>
        {policies?.payment_terms && (
          <>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#D4AF37', mt: 2, mb: 1 }}>
              Payment Terms
            </Typography>
            <Typography variant="body2" sx={{ lineHeight: 1.8, whiteSpace: 'pre-line' }}>
              {policies.payment_terms}
            </Typography>
          </>
        )}
        {policies?.cancellation_policy && (
          <>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#D4AF37', mt: 3, mb: 1 }}>
              Cancellation Policy
            </Typography>
            <Typography variant="body2" sx={{ lineHeight: 1.8, whiteSpace: 'pre-line' }}>
              {policies.cancellation_policy}
            </Typography>
          </>
        )}
        {policies?.terms_and_conditions && (
          <>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#D4AF37', mt: 3, mb: 1 }}>
              Terms & Conditions
            </Typography>
            <Typography variant="body2" sx={{ lineHeight: 1.8, whiteSpace: 'pre-line' }}>
              {policies.terms_and_conditions}
            </Typography>
          </>
        )}
      </Box>

      {/* Payment Information */}
      <Box sx={{ 
        bgcolor: '#fff', 
        p: 5, 
        borderRadius: 4, 
        boxShadow: '0 15px 50px rgba(0,0,0,0.1)',
        pageBreakInside: 'avoid',
        breakInside: 'avoid'
      }}>
        <Typography variant="h4" sx={{ 
          fontWeight: 'bold', 
          color: '#D4AF37', 
          mb: 4,
          fontFamily: 'Georgia, serif'
        }}>
          💳 Payment Information
        </Typography>
        <Grid container spacing={3}>
          {payment?.bank_name && (
            <Grid item xs={6}>
              <Typography variant="caption" color="text.secondary">Bank Name</Typography>
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{payment.bank_name}</Typography>
            </Grid>
          )}
          {payment?.account_number && (
            <Grid item xs={6}>
              <Typography variant="caption" color="text.secondary">Account Number</Typography>
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{payment.account_number}</Typography>
            </Grid>
          )}
          {payment?.ifsc_code && (
            <Grid item xs={6}>
              <Typography variant="caption" color="text.secondary">IFSC Code</Typography>
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{payment.ifsc_code}</Typography>
            </Grid>
          )}
          {payment?.upi_ids && payment.upi_ids[0] && (
            <Grid item xs={6}>
              <Typography variant="caption" color="text.secondary">UPI ID</Typography>
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{payment.upi_ids[0]}</Typography>
            </Grid>
          )}
        </Grid>
        
        {payment?.qr_code_url && (
          <Box sx={{ mt: 4, textAlign: 'center', p: 3, bgcolor: '#FFF8DC', borderRadius: 2, border: '1px dashed #D4AF37' }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: '#8B4513' }}>
              Scan to Pay
            </Typography>
            <img 
              src={payment.qr_code_url} 
              alt="Payment QR Code" 
              style={{ maxWidth: '220px', maxHeight: '220px', border: '3px solid #D4AF37', borderRadius: '12px' }}
            />
          </Box>
        )}
      </Box>

      {/* Footer */}
      <Box sx={{ 
        mt: 5, 
        textAlign: 'center', 
        p: 4, 
        bgcolor: '#8B4513', 
        color: '#fff', 
        borderRadius: 3,
        pageBreakInside: 'avoid',
        breakInside: 'avoid'
      }}>
        <Typography variant="h6" sx={{ mb: 1, color: '#D4AF37', fontFamily: 'Georgia, serif' }}>
          Thank You for Choosing Excellence
        </Typography>
        <Typography variant="body2">
          We look forward to crafting an unforgettable journey for you.
        </Typography>
      </Box>
    </Box>
  );
};

// Minimalist Classic Template - Enhanced (Includes Hero/Gallery Images)
export const MinimalistClassicTemplate = ({ quotation }) => {
  const { 
    client_name, client_email, client_mobile, display_title, overview, 
    itinerary, costing, policies, payment, company, __client_name, 
    __client_email, __client_mobile
  } = quotation;

  const finalClientName = __client_name || client_name || 'Customer';
  const finalClientEmail = __client_email || client_email || '';
  const finalClientMobile = __client_mobile || client_mobile || '';
  const heroImage = getImageUrl(quotation, 'hero_image');
  const galleryImages = getImageUrl(quotation, 'gallery_images');
  
  return (
    <Box sx={{ p: 5, bgcolor: '#fff', minHeight: '100vh', maxWidth: '900px', mx: 'auto' }}>
      {/* Header */}
      <Box sx={{ 
        textAlign: 'center', 
        mb: 5, 
        pb: 3, 
        borderBottom: '3px solid #000',
        pageBreakInside: 'avoid',
        breakInside: 'avoid'
      }}>
        <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#000', mb: 1 }}>
          {company?.name || 'Holidays Planners'}
        </Typography>
        <Typography variant="body2" color="text.secondary">{company?.email} | {company?.mobile}</Typography>
        {company?.website && (
          <Typography variant="caption" color="text.secondary">{company.website}</Typography>
        )}
      </Box>

      {/* Quotation Header */}
      <Box sx={{ 
        mb: 5,
        pageBreakInside: 'avoid',
        breakInside: 'avoid'
      }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3 }}>
          Travel Quotation
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="caption" sx={{ textTransform: 'uppercase', color: '#666' }}>
              Prepared For
            </Typography>
            <Typography variant="h6" fontWeight="bold">{finalClientName}</Typography>
            {finalClientEmail && <Typography variant="body2" color="text.secondary">{finalClientEmail}</Typography>}
            {finalClientMobile && <Typography variant="body2" color="text.secondary">{finalClientMobile}</Typography>}
          </Grid>
          <Grid item xs={6} sx={{ textAlign: 'right' }}>
            <Typography variant="caption" sx={{ textTransform: 'uppercase', color: '#666' }}>
              Date
            </Typography>
            <Typography variant="body1">
              {new Date(quotation.date || Date.now()).toLocaleDateString('en-IN')}
            </Typography>
            <Typography variant="caption" sx={{ textTransform: 'uppercase', color: '#666', mt: 2, display: 'block' }}>
              Quote ID
            </Typography>
            <Typography variant="body1" fontWeight="bold">#{quotation.id || 'DRAFT'}</Typography>
          </Grid>
        </Grid>
      </Box>

      {/* Hero Image */}
      {heroImage && (
        <Box sx={{ 
          mb: 4, 
          border: '1px solid #000', 
          p: 1,
          pageBreakInside: 'avoid',
          breakInside: 'avoid'
        }}>
          <img 
            src={heroImage} 
            alt="Trip Hero" 
            style={{ width: '100%', height: '200px', objectFit: 'cover' }}
          />
        </Box>
      )}

      <Divider sx={{ my: 4 }} />

      {/* Package Details */}
      <Box sx={{ 
        mb: 5,
        pageBreakInside: 'avoid',
        breakInside: 'avoid'
      }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2, pb: 1, borderBottom: '2px solid #000' }}>
          {display_title || 'Travel Package'}
        </Typography>
        <Typography variant="body1" sx={{ lineHeight: 2, color: '#333', mt: 2, whiteSpace: 'pre-line' }}>
          {overview}
        </Typography>
      </Box>

      {/* Gallery Images */}
      {galleryImages && galleryImages.length > 0 && (
          <Box sx={{ 
            mb: 5, 
            p: 3, 
            border: '1px solid #ddd', 
            bgcolor: '#f9f9f9',
            pageBreakInside: 'avoid',
            breakInside: 'avoid'
          }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3, textTransform: 'uppercase', borderBottom: '1px solid #ddd', pb: 1 }}>
              Gallery
            </Typography>
            <Grid container spacing={1}>
              {galleryImages.slice(0, 6).map((img, idx) => (
                <Grid item xs={4} key={idx}>
                  <img 
                    src={img} 
                    alt={`Gallery Image ${idx + 1}`} 
                    style={{ width: '100%', height: '100px', objectFit: 'cover', border: '1px solid #ccc' }}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
      )}

      {/* Itinerary - FIXED: Added page-break controls */}
      {itinerary && itinerary.length > 0 && (
        <Box sx={{ mb: 5 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3, textTransform: 'uppercase' }}>
            Itinerary
          </Typography>
          {itinerary.map((day, idx) => (
            <Box 
              key={idx} 
              sx={{ 
                mb: 3, 
                pb: 3, 
                borderBottom: idx < itinerary.length - 1 ? '1px solid #eee' : 'none',
                // CRITICAL FIX: Prevent boxes from splitting across pages
                pageBreakInside: 'avoid',
                breakInside: 'avoid'
              }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                Day {day.day}: {day.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.8, whiteSpace: 'pre-line' }}>
                {day.description}
              </Typography>
            </Box>
          ))}
        </Box>
      )}

      {/* Costing */}
      <Box sx={{ 
        mb: 5,
        pageBreakInside: 'avoid',
        breakInside: 'avoid'
      }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3, textTransform: 'uppercase' }}>
          Pricing Breakdown
        </Typography>
        <Table sx={{ border: '2px solid #000' }}>
          <TableHead>
            <TableRow sx={{ bgcolor: '#000' }}>
              <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Description</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 'bold' }} align="center">Qty</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 'bold' }} align="right">Unit Price</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 'bold' }} align="right">Amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {costing?.items?.map((item, idx) => (
              <TableRow key={idx} sx={{ '&:nth-of-type(odd)': { bgcolor: '#f9f9f9' } }}>
                <TableCell>{item.name}</TableCell>
                <TableCell align="center">{item.quantity}</TableCell>
                <TableCell align="right">₹{item.unit_price?.toLocaleString('en-IN')}</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'medium' }}>
                  ₹{(item.quantity * item.unit_price)?.toLocaleString('en-IN')}
                </TableCell>
              </TableRow>
            ))}
            <TableRow sx={{ bgcolor: '#000' }}>
              <TableCell colSpan={3} sx={{ fontWeight: 'bold', color: '#fff', fontSize: '1.1rem' }}>
                TOTAL AMOUNT
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold', color: '#fff', fontSize: '1.2rem' }}>
                ₹{costing?.total_amount?.toLocaleString('en-IN')}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Box>

      {/* Terms & Conditions */}
      <Box sx={{ 
        mb: 5,
        pageBreakInside: 'avoid',
        breakInside: 'avoid'
      }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3, textTransform: 'uppercase' }}>
          Terms & Conditions
        </Typography>
        {policies?.payment_terms && (
          <>
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mt: 2, mb: 1 }}>
              Payment Terms
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.8, whiteSpace: 'pre-line' }}>
              {policies.payment_terms}
            </Typography>
          </>
        )}
        {policies?.cancellation_policy && (
          <>
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mt: 2, mb: 1 }}>
              Cancellation Policy
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.8, whiteSpace: 'pre-line' }}>
              {policies.cancellation_policy}
            </Typography>
          </>
        )}
        {policies?.terms_and_conditions && (
          <>
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mt: 2, mb: 1 }}>
              Terms & Conditions
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.8, whiteSpace: 'pre-line' }}>
              {policies.terms_and_conditions}
            </Typography>
          </>
        )}
      </Box>

      {/* Payment Details */}
      <Box sx={{ 
        bgcolor: '#f5f5f5', 
        p: 4, 
        borderRadius: 1, 
        border: '1px solid #ddd',
        pageBreakInside: 'avoid',
        breakInside: 'avoid'
      }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3, textTransform: 'uppercase' }}>
          Payment Information
        </Typography>
        <Grid container spacing={3}>
          {payment?.bank_name && (
            <Grid item xs={6}>
              <Typography variant="caption" sx={{ textTransform: 'uppercase', color: '#666' }}>
                Bank Name
              </Typography>
              <Typography variant="body2" fontWeight="medium">{payment.bank_name}</Typography>
            </Grid>
          )}
          {payment?.account_number && (
            <Grid item xs={6}>
              <Typography variant="caption" sx={{ textTransform: 'uppercase', color: '#666' }}>
                Account Number
              </Typography>
              <Typography variant="body2" fontWeight="medium">{payment.account_number}</Typography>
            </Grid>
          )}
          {payment?.ifsc_code && (
            <Grid item xs={6}>
              <Typography variant="caption" sx={{ textTransform: 'uppercase', color: '#666' }}>
                IFSC Code
              </Typography>
              <Typography variant="body2" fontWeight="medium">{payment.ifsc_code}</Typography>
            </Grid>
          )}
          {payment?.upi_ids && payment.upi_ids[0] && (
            <Grid item xs={6}>
              <Typography variant="caption" sx={{ textTransform: 'uppercase', color: '#666' }}>
                UPI ID
              </Typography>
              <Typography variant="body2" fontWeight="medium">{payment.upi_ids[0]}</Typography>
            </Grid>
          )}
        </Grid>
        
        {payment?.qr_code_url && (
          <Box sx={{ mt: 3, textAlign: 'center', p: 2, bgcolor: '#fff', borderRadius: 1, border: '1px dashed #000' }}>
            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 'bold', textTransform: 'uppercase' }}>
              Scan to Pay
            </Typography>
            <img 
              src={payment.qr_code_url} 
              alt="Payment QR Code" 
              style={{ maxWidth: '180px', maxHeight: '180px', border: '2px solid #000' }}
            />
          </Box>
        )}
      </Box>

      {/* Footer */}
      <Box sx={{ 
        mt: 5, 
        pt: 3, 
        borderTop: '2px solid #000', 
        textAlign: 'center',
        pageBreakInside: 'avoid',
        breakInside: 'avoid'
      }}>
        <Typography variant="body2" color="text.secondary">
          Thank you for your business. We look forward to serving you.
        </Typography>
      </Box>
    </Box>
  );
};