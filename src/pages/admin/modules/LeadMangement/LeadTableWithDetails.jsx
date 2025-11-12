// fileName: LeadTableWithDetails.jsx
import React, { useState } from 'react';
import {
  Box,
  Button,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Chip,
  Tooltip,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import { Delete, Download, Edit, MoreVert as MoreVertIcon, Visibility, Email, WhatsApp } from '@mui/icons-material';
import LeadDetailsDialog from './LeadDetailsDialog'; 

const LeadTableWithDetails = ({ 
  leads, 
  selectedLeads, 
  toggleSelectLead, 
  onDeleteLead,
  onRefresh,
  onLocalUpdate 
}) => {
  const [openDetails, setOpenDetails] = useState(false);
  const [selectedLeadForDetails, setSelectedLeadForDetails] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuLead, setMenuLead] = useState(null);
  const isMenuOpen = Boolean(anchorEl);

  const isSelected = (id) => selectedLeads.includes(id);

  const handleExport = () => {
    const csv = [
      ['Name', 'Email', 'Mobile', 'Destination', 'Trip Type', 'Status', 'Priority', 'Source', 'Created'],
      ...leads.map(lead => [
        lead.name,
        lead.email,
        lead.mobile,
        lead.destination_type,
        lead.trip_type,
        lead.status,
        lead.priority,
        lead.source,
        new Date(lead.created_at).toLocaleDateString(),
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leads_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };
  
  // --- Menu Handlers ---
  const handleMenuClick = (event, lead) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setMenuLead(lead);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuLead(null);
  };
  
  // --- Detail Dialog Handlers ---
  const handleViewDetails = (lead) => {
    setSelectedLeadForDetails(lead);
    setOpenDetails(true);
    handleMenuClose();
  };

  const handleDetailsClose = () => {
    setOpenDetails(false);
    setSelectedLeadForDetails(null);
  };

  // --- Quick Action Handlers ---
  const handleWhatsApp = (lead) => {
    const phoneNumber = lead.mobile.replace(/[^0-9]/g, '');
    const message = encodeURIComponent(`Hello ${lead.name}, Thank you for your interest!`);
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
    handleMenuClose();
  };

  const handleEmail = (lead) => {
    const subject = encodeURIComponent('Regarding Your Travel Enquiry');
    const body = encodeURIComponent(`Dear ${lead.name},\n\nThank you for contacting us.\n\nBest regards,\nHolidays Planners`);
    window.open(`mailto:${lead.email}?subject=${subject}&body=${body}`, '_blank');
    handleMenuClose();
  };


  return (
    <>
      <TableContainer component={Paper}>
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end' }}>
           <Button
              variant="outlined"
              startIcon={<Download />}
              onClick={handleExport}
            >
              Export CSV
            </Button>
        </Box>
        <Table sx={{ minWidth: 650 }} aria-label="lead table">
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                {/* Individual row checkbox */}
              </TableCell>
              <TableCell>Lead Info</TableCell>
              <TableCell>Destination</TableCell>
              <TableCell>Trip Type</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Priority</TableCell>
              <TableCell>Source</TableCell>
              <TableCell>Created</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {leads.map((lead) => {
              const isItemSelected = isSelected(lead.id);
              const isManualLead = lead.type === 'lead';

              return (
                <TableRow
                  hover
                  role="checkbox"
                  aria-checked={isItemSelected}
                  tabIndex={-1}
                  key={lead.id}
                  selected={isItemSelected}
                  onClick={isManualLead ? () => toggleSelectLead(lead.id) : () => handleViewDetails(lead)}
                  sx={{ cursor: 'pointer' }}
                >
                  <TableCell padding="checkbox">
                    <Checkbox 
                      color="primary"
                      checked={isItemSelected}
                      disabled={!isManualLead}
                      onClick={(event) => {
                        event.stopPropagation();
                        toggleSelectLead(lead.id);
                      }}
                    />
                  </TableCell>
                  <TableCell component="th" scope="row">
                    <Typography variant="subtitle1">{lead.name}</Typography>
                    <Typography variant="body2" color="text.secondary">{lead.email}</Typography>
                    <Typography variant="body2" color="text.secondary">{lead.mobile}</Typography>
                  </TableCell>
                  <TableCell>{lead.destination_type}</TableCell>
                  <TableCell>{lead.trip_type}</TableCell>
                  <TableCell>
                    <Chip label={lead.status} size="small" color={
                      lead.status === 'new' ? 'primary' : 
                      lead.status === 'booked' ? 'success' : 
                      'default'
                    } />
                  </TableCell>
                  <TableCell>
                    <Chip label={lead.priority} size="small" color={
                      lead.priority === 'high' ? 'error' : 
                      lead.priority === 'medium' ? 'warning' : 
                      'default'
                    } />
                  </TableCell>
                  <TableCell>{lead.source}</TableCell>
                  <TableCell>{new Date(lead.created_at).toLocaleDateString()}</TableCell>
                  <TableCell align="right" onClick={(e) => e.stopPropagation()}>
                    <IconButton
                      aria-label="more"
                      aria-controls="long-menu"
                      aria-haspopup="true"
                      onClick={(e) => handleMenuClick(e, lead)}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        {leads.length === 0 && (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography color="text.secondary">No leads matching the current filters.</Typography>
          </Box>
        )}
      </TableContainer>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={isMenuOpen}
        onClose={handleMenuClose}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem onClick={() => handleViewDetails(menuLead)}>
          <Visibility sx={{ mr: 1 }} fontSize="small" /> View Details
        </MenuItem>
        
        {menuLead?.type === 'lead' && (
          <MenuItem onClick={() => { handleViewDetails(menuLead); }}> 
            <Edit sx={{ mr: 1 }} fontSize="small" /> Edit Lead 
          </MenuItem>
        )}
        
        <MenuItem onClick={() => onDeleteLead(menuLead)} disabled={menuLead?.type !== 'lead'}>
          <Delete sx={{ mr: 1 }} fontSize="small" /> Delete (Manual only)
        </MenuItem>
        
        {/* Quick Actions */}
        <MenuItem onClick={() => handleWhatsApp(menuLead)}>
          <WhatsApp sx={{ mr: 1 }} fontSize="small" /> Send WhatsApp
        </MenuItem>
        <MenuItem onClick={() => handleEmail(menuLead)}>
          <Email sx={{ mr: 1 }} fontSize="small" /> Send Email
        </MenuItem>
      </Menu>

      {/* Lead Details Dialog */}
      {selectedLeadForDetails && (
        <LeadDetailsDialog
          open={openDetails}
          onClose={handleDetailsClose}
          lead={selectedLeadForDetails}
          onRefresh={onRefresh}
          onLocalUpdate={onLocalUpdate}
        />
      )}
    </>
  );
};

export default LeadTableWithDetails;