import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import LoadingAnim from '../../components/form_template/loading-anim';
import { getInvolvement, setInvolvement, clearInvolvement } from '../../actions/individual-action';
import { getAllImpactAreasByUser } from '../../actions/impact-area-action';
import { NotificationManager } from 'react-notifications';
import IndividualInvolvementForm from '../../components/individual/individual-involvement-form';
import { individualCompleteBasicInfoPage, individualCompletePrivacyPage } from '../../constants/route-paths';

const Involvement = (props) => {
    const [loading, setLoading] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const getInitialInfo = () => {
        const user = props.auth.user;

        if (user && user._id) {
            props.dispatch(getAllImpactAreasByUser(user._id));
            props.dispatch(getInvolvement(user._id));
        }
    };
    const handleSetResponse = () => {
        const { success, message } = props.setInvolvementResponse;
        if (success) {
            NotificationManager.success(message, 'success');
            if (!editMode) {
                props.history.push(individualCompletePrivacyPage);
                props.dispatch(clearInvolvement());
            }
        } else if (success === false) NotificationManager.error(message, 'Failed');
    };
    const handleGetResponse = () => {
        const { success, involvement } = props.getInvolvementResponse;
        if (success) {
        }
    };
    useEffect(() => {
        const url = window.location.pathname;
        if (url.split('/')[1] === 'edit') setEditMode(true);
        getInitialInfo();
    }, [props.auth]);
    useEffect(() => {
        handleGetResponse();
    }, [props.getInvolvementResponse]);
    useEffect(() => {
        handleSetResponse();
    }, [props.setInvolvementResponse]);

    const onSubmit = (values) => {
        setLoading(true);
        props.dispatch(setInvolvement(props.auth.user._id, values));
        setLoading(false);
    };
    const handleBackButton = () => {
        props.history.push(individualCompleteBasicInfoPage);
    };
    const handleSkipButton = () => {
        props.history.push(individualCompletePrivacyPage);
    };
    if (loading) return <LoadingAnim />;
    else
        return (
            <IndividualInvolvementForm
                editMode={editMode}
                handleOnSubmit={props.handleSubmit((event) => {
                    onSubmit(event);
                })}
                allImpactAreas={props.getImpactAreaResponse.success ? props.getImpactAreaResponse.impactAreas : []}
                handleBackButton={handleBackButton}
                handleSkipButton={handleSkipButton}
            />
        );
};
const mapStateToProps = (state) => {
    const getImpactAreaResponse = state.ImpactArea.getImpactAreasByUser;
    const getInvolvementResponse = state.Individual.getInvolvement;
    const setInvolvementResponse = state.Individual.setInvolvement;
    let initialValues = {};

    if (getInvolvementResponse.success) {
        initialValues = getInvolvementResponse.involvement;
    }
    console.log('initialValues', initialValues);
    return {
        getImpactAreaResponse,
        initialValues,
        getInvolvementResponse,
        setInvolvementResponse,
    };
};
export default connect(
    mapStateToProps,
    null,
)(
    reduxForm({
        form: 'Involvement',
        enableReinitialize: true,
    })(Involvement),
);
