"use client";

import CloseOutlined from '@mui/icons-material/CloseOutlined';
import { Accordion, AccordionDetails, AccordionGroup, AccordionSummary, Box, DialogContent, DialogTitle, IconButton, Modal, ModalDialog, Sheet, Typography } from "@mui/joy";
import { Component } from "react";
import { ErrorContext } from "./ErrorContext";
import { ProviderContext } from "./types";

interface State {
    error: string;
    stack?: string;
    contextValue: ProviderContext
}
interface ErrorProviderProps {
    children?: React.ReactNode | React.ReactNode[];
}

export let showError: ProviderContext['showError'];

export default class ErrorProvider extends Component<ErrorProviderProps, State> {
    constructor(props: ErrorProviderProps) {
        super(props)
        showError = this.showError;
        this.state = {
            error: "",
            contextValue: {
                showError: this.showError.bind(this),
            }
        };
    }

    showError = (msg: string, stack?: string) => {
        this.setState({ error: msg, stack: stack })
    }

    render() {
        const { error, stack, contextValue } = this.state;

        const handleClose = () => {
            this.setState({ error: "" });
        };

        return (
            <>
                <ErrorContext.Provider value={contextValue}></ErrorContext.Provider>
                {!!error &&
                    <Modal open={true}>
                        <ModalDialog>
                            <DialogTitle sx={{ paddingTop: 3, paddingBottom: .5 }}>
                                <IconButton size="sm" onClick={(e) => handleClose()} sx={{ position: 'absolute', right: 8, top: 8 }}>
                                    <CloseOutlined fontSize="small" />
                                </IconButton>
                                Error
                            </DialogTitle>
                            <DialogContent>
                                <Typography>
                                    {error}
                                </Typography>
                                {stack && stack != error &&
                                    <Box mt={2}>
                                        <AccordionGroup variant="outlined">
                                            <Accordion>
                                                <AccordionSummary>Stack Trace</AccordionSummary>
                                                <AccordionDetails>
                                                    <Sheet color="neutral" variant="soft">
                                                        <Box p={1}>
                                                            <Typography component={"div"} level="body-sm" mt={1} fontFamily={"monospace"} fontSize={"12px"} position={"relative"}>
                                                                <pre style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}>{stack}</pre>
                                                            </Typography>
                                                        </Box>
                                                    </Sheet>
                                                </AccordionDetails>
                                            </Accordion>
                                        </AccordionGroup>
                                    </Box>
                                }
                            </DialogContent>
                        </ModalDialog>
                    </Modal>
                }
            </>

        )
    }
}
