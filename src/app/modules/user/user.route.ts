import { Router } from 'express';
import validateData from '../../../middlewares/validateRequest';
import { UserZodValidation } from './user.validation';
import { UserController } from './user.controller';
import { auth } from '../../../middlewares/auth';

const router = Router();

// Action --> User Profile
// router.route('/me')

// Action in the root route --> /
router
    .route('/')
    .get(auth(), UserController.getUsers)
    .post(
        validateData(UserZodValidation.createUserZodSchema),
        UserController.createUser
    );

// Register Admin
router
    .route('/admin')
    .post(
        auth('superadmin'),
        validateData(UserZodValidation.createAdminZodSchema),
        UserController.createAdmin
    );

// Add address Admin | superadmin | customer
router
    .route('/address/:id')
    .post(
        // Add address
        auth('superadmin', 'admin', 'customer'),
        UserController.addCustomerAddress
    )
    .patch(
        // Update Address
        auth('superadmin', 'admin', 'customer'),
        UserController.updateCustomerAddress
    )
    .delete(
        // Delete Address
        auth('superadmin', 'admin', 'customer'),
        UserController.deleteCustomerAddress
    );
// User can be change the address active status

router
    .route('/address/status/:id')
    .patch(
        auth('superadmin', 'admin', 'customer'),
        UserController.updateCustomerAddressStatus
    );

// Action with single --> id
router
    .route('/:id')
    .get(auth(), UserController.getSingleUsers)
    .patch(
        auth(),
        validateData(UserZodValidation.updateUserZodSchema),
        UserController.updateUser
    );

export const UserRoutes = router;
