import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Dialog,
    DialogContent,
    Typography,
    Button,
    Checkbox
} from "@mui/material";
import React, { ReactNode, useState } from "react";
import { DialogBody } from "next/dist/client/components/react-dev-overlay/internal/components/Dialog";
import { COOKIE_CONSENT_NAME, OptionalConsent } from "./GoogleAnalytics";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import Cookies from "js-cookie";
import { closeCookiesModal } from "../../redux/layoutSlice";
import { useTranslation } from "next-i18next";

type CookieModalProps = {
    onConsentChange: (consent: OptionalConsent) => void;
};

const CookieModal = ({ onConsentChange }: CookieModalProps) => {
    const { t } = useTranslation();
    const cookieSettings = Cookies.get(COOKIE_CONSENT_NAME);
    const defaultCookieSettings: OptionalConsent = cookieSettings
        ? JSON.parse(cookieSettings)
        : {
            adUserDataConsentGranted: false,
            adPersonalizationConsentGranted: false,
            analyticsConsentGranted: false,
            personalizationConsentGranted: false
        };

    const [currentSettings, setCurrentSettings] = useState<OptionalConsent>(defaultCookieSettings);

    const dispatch = useDispatch();
    const cookieModalOpen = useSelector<RootState>(state => state.layout.cookiesModalOpen) as boolean;

    const handleSaveSettings = (allTrue?: boolean) => {
        const newSettings = allTrue
            ? {
                adUserDataConsentGranted: true,
                adPersonalizationConsentGranted: true,
                analyticsConsentGranted: true,
                personalizationConsentGranted: true
            }
            : currentSettings;
        onConsentChange(newSettings);
        dispatch(closeCookiesModal());
    };

    const toggleSetting = (setting: keyof OptionalConsent) => () =>
        setCurrentSettings({ ...currentSettings, [setting]: !currentSettings[setting] });

    return (
        <Dialog open={cookieModalOpen} onClose={() => dispatch(closeCookiesModal())}>
            <DialogBody>
                <DialogContent>
                    <Typography textAlign="center" variant="h5" sx={{ marginBottom: "8px" }}>
                        {t("consent.title")}
                    </Typography>
                    <Typography textAlign="justify">{t("consent.description")}</Typography>
                    <Box sx={{ width: "100%", textAlign: "right", margin: "8px 0 16px" }}>
                        <Button variant="contained" onClick={() => handleSaveSettings(true)}>
                            {t("consent.acceptAll")}
                        </Button>
                    </Box>
                    <Typography textAlign="center" variant="h5" sx={{ marginBottom: "8px" }}>
                        {t("consent.manageTitle")}
                    </Typography>
                    <AccordionPanel title={t("consent.functionalTitle").toUpperCase()} checked={true}>
                        <Typography textAlign="justify">{t("consent.functionalDescription")}</Typography>
                    </AccordionPanel>
                    <AccordionPanel
                        title={t("consent.adUserDataTitle").toUpperCase()}
                        checked={currentSettings.adUserDataConsentGranted}
                        setChecked={toggleSetting("adUserDataConsentGranted")}
                    >
                        <Typography textAlign="justify">{t("consent.adUserDataDescription")}</Typography>
                    </AccordionPanel>
                    <AccordionPanel
                        title={t("consent.adPersonalizationTitle").toUpperCase()}
                        checked={currentSettings.adPersonalizationConsentGranted}
                        setChecked={toggleSetting("adPersonalizationConsentGranted")}
                    >
                        <Typography textAlign="justify">{t("consent.adPersonalizationDescription")}</Typography>
                    </AccordionPanel>
                    <AccordionPanel
                        title={t("consent.analyticsTitle").toUpperCase()}
                        checked={currentSettings.analyticsConsentGranted}
                        setChecked={toggleSetting("analyticsConsentGranted")}
                    >
                        <Typography textAlign="justify">{t("consent.analyticsDescription")}</Typography>
                    </AccordionPanel>
                    <AccordionPanel
                        title={t("consent.personalizationTitle").toUpperCase()}
                        checked={currentSettings.personalizationConsentGranted}
                        setChecked={toggleSetting("personalizationConsentGranted")}
                    >
                        <Typography textAlign="justify">{t("consent.personalizationDescription")}</Typography>
                    </AccordionPanel>
                    <Button
                        variant="contained"
                        fullWidth
                        onClick={() => handleSaveSettings()}
                        sx={{ marginTop: "16px" }}
                    >
                        {t("consent.saveSettings")}
                    </Button>
                </DialogContent>
            </DialogBody>
        </Dialog>
    );
};

type AccordionPanelProps = {
    title: string;
    children: ReactNode;
    checked: boolean;
    setChecked?: (checked: boolean) => void;
};

const AccordionPanel = ({ title, checked, setChecked, children }: AccordionPanelProps) => (
    <Accordion
        disableGutters
        sx={{
            width: "100%",
            borderBottom: "1px solid black",
            "::before": {
                opacity: 0
            }
        }}
        elevation={0}
        square
    >
        <AccordionSummary
            expandIcon={
                <div onClick={event => event.stopPropagation()}>
                    <Checkbox
                        inputProps={{ "aria-label": "primary checkbox" }}
                        checked={checked}
                        disabled={!setChecked}
                        onChange={(_, checked) => setChecked?.(checked)}
                    />
                </div>
            }
            sx={{
                padding: 0,
                ".MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
                    transform: "none"
                }
            }}
        >
            {title}
        </AccordionSummary>
        <AccordionDetails sx={{ padding: "8px 0 16px" }}>{children}</AccordionDetails>
    </Accordion>
);

export default CookieModal;
