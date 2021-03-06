const organization = require('express').Router();
const OrganizationController = require('../controllers/organization-controller');
const { allowIfLoggedIn } = require('../middlewares/access-control');

organization.get('/:userId/basic-info', allowIfLoggedIn, OrganizationController.getBasicInfo);
organization.get('/:userId/service-info', allowIfLoggedIn, OrganizationController.getServiceInfo);
organization.get('/:userId/internal-link', allowIfLoggedIn, OrganizationController.getInternalLink);

organization.put('/:userId/basic-info', allowIfLoggedIn, OrganizationController.setBasicInfo);
organization.put('/:userId/service-info', allowIfLoggedIn, OrganizationController.setServiceInfo);
organization.put('/:userId/internal-link', allowIfLoggedIn, OrganizationController.setInternalLink);

organization.get('/', OrganizationController.getAll);
organization.get('/:userId/public-info', OrganizationController.getPublicInfo);

organization.get('/:userId/events', OrganizationController.getAllEvents);
organization.post('/change-address', OrganizationController.changeAddress);
module.exports = organization;
