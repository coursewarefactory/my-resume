import React, { useCallback } from 'react';

import cn from 'classnames';
import { FormattedMessage } from 'react-intl';
import { createUseStyles, useTheme } from 'react-jss';
import { Formik, useFormikContext } from 'formik';

import useMediaQuery from '@material-ui/core/useMediaQuery';
import { Button } from '@wld/ui';

import { Dialog, DialogActions, DialogContent } from '@material-ui/core';

import { DialogTitle } from '../dialog/dialog_title/dialog_title';

import { styles } from './edit_dialog_styles';

const useStyles = createUseStyles(styles);

const EditDialogComponent = ({
    open,
    onClose,
    fullScreen,
    data,
    onEdit,
    children,
    title = '✏️',
    validationSchema,
    classes: receivedClasses = {}
}) => {
    const classes = useStyles();
    const theme = useTheme();
    const isMobile = useMediaQuery(`(max-width: ${theme.screenSizes.small}px)`);

    return (
        <Dialog
            fullScreen={fullScreen || isMobile}
            classes={{
                paper: cn(classes.paper, receivedClasses.paper, fullScreen && classes.fullScreen)
            }}
            open={open}
            onClose={onClose}
        >
            <Formik
                validateOnChange={false}
                initialValues={data}
                onSubmit={newValues => onEdit(newValues)}
                validationSchema={validationSchema}
            >
                <TitleContent
                    title={title}
                    fullScreen={fullScreen}
                    onClose={onClose}
                    classes={classes}
                    receivedClasses={receivedClasses}
                >
                    {children}
                </TitleContent>
            </Formik>
        </Dialog>
    );
};

const TitleContent = ({
    title,
    fullScreen,
    onClose,
    children,
    classes,
    receivedClasses
}) => {
    const { handleSubmit, setFieldValue, values } = useFormikContext();
    return (
        <>
            <div className={classes.titleContainer}>
                <DialogTitle>
                    {title}
                </DialogTitle>
                {fullScreen && (
                    <Actions
                        fullScreen
                        onClose={onClose}
                        handleSubmit={handleSubmit}
                        classes={classes}
                        receivedClasses={receivedClasses}
                    />
                )}
            </div>
            <Content
                onClose={onClose}
                handleSubmit={handleSubmit}
                setFieldValue={setFieldValue}
                values={values}
                fullScreen={fullScreen}
                classes={classes}
                receivedClasses={receivedClasses}
            >
                {children}
            </Content>
        </>
    );
};

const Content = ({ children, onClose, handleSubmit, setFieldValue, values, fullScreen, classes, receivedClasses }) => {
    const handleValueChange = useCallback(
        name => value => {
            console.debug(`Setting field ${name} to value ${value}`);
            return setFieldValue(name, value);
        },
        [setFieldValue]
    );
    const toggleValue = useCallback(name => () => setFieldValue(name, !values[name]), [setFieldValue, values]);

    return (
        <>
            <DialogContent
                classes={{
                    root: cn(classes.content, receivedClasses.content)
                }}
            >
                {children({ handleValueChange, toggleValue })}
            </DialogContent>
            {!fullScreen && (
                <Actions
                    onClose={onClose}
                    handleSubmit={handleSubmit}
                    classes={classes}
                    receivedClasses={receivedClasses}
                />
            )}
        </>
    );
};

const Actions = ({ onClose, handleSubmit, fullScreen, classes, receivedClasses }) => (
    <DialogActions
        classes={{
            root: cn(classes.actions, receivedClasses.actions)
        }}
    >
        <Button size="small" onClick={onClose}>
            <FormattedMessage id="Main.lang.close" defaultMessage="Close" />
        </Button>
        <Button variant={fullScreen ? 'contained' : 'text'} type="submit" size="small" color="primary" onClick={handleSubmit}>
            <FormattedMessage id="Main.lang.save" defaultMessage="Save" />
        </Button>
    </DialogActions>
);

export const EditDialog = EditDialogComponent;
