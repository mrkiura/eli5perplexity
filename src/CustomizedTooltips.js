import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import { TextareaAutosize as BaseTextareaAutosize } from '@mui/base/TextareaAutosize';
import subjectText from './subjectText';
import axios from "axios";
import LinearProgress from '@mui/material/LinearProgress';

const HtmlTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} arrow classes={{ popper: className }} />
))(({ theme }) => ({
    [`& .${tooltipClasses.arrow}`]: {
        color: theme.palette.common.white,
    },
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: theme.palette.common.white,
        color: 'black',
    },
}));

const apiKey = process.env.REACT_APP_PERPLEXITY_API_KEY;

export default function CustomizedTooltips() {

    const [selection, setSelection] = useState('');

    const [loading, setLoading] = useState(false)

    const [textResult, setTextResult] = useState('')

    const [showTooltip, setShowTooltip] = useState(false);

    const grey = {
        50: '#F3F6F9',
        100: '#E5EAF2',
        200: '#DAE2ED',
        300: '#C7D0DD',
        400: '#B0B8C4',
        500: '#9DA8B7',
        600: '#6B7A90',
        700: '#434D5B',
        800: '#303740',
        900: '#1C2025',
    };

    const Textarea = styled(BaseTextareaAutosize)(
        ({ theme }) => `
        width: 900px;
        font-family: 'IBM Plex Sans', sans-serif;
        font-size: 0.875rem;
        font-weight: 400;
        line-height: 1.5;
        padding: 12px;
        border-radius: 12px 12px 0 12px;
        color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
        background: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
        border: 1px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
        box-shadow: 0px 2px 2px ${theme.palette.mode === 'dark' ? grey[900] : grey[50]};

      `,
    );

    const handleTextSelect = () => {
        const selected = window.getSelection();
        setSelection(selected.toString())
        setShowTooltip(true);
    };

    const handleOnlineLookup = (event) => {
        event.stopPropagation();
        setLoading(true)
        let data = JSON.stringify({
            "model": "pplx-7b-online",
            "messages": [
                {
                    "role": "system",
                    "content": "Be precise and concise."
                },
                {
                    "role": "user",
                    "content": `Let us find out more about: ${selection}. Always return reference links at the end. Keep it very brief. Use spacing and paragraph your content`
                }
            ]
        });

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: '/chat/completions',
            headers: {
                'accept': 'application/json',
                'authorization': `Bearer ${apiKey}`,
                'content-type': 'application/json',
            },
            data: data
        };
        axios.request(config)
            .then((response) => {
                setTextResult(response.data.choices[0].message.content)
                setLoading(false)
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const handleEscape = () => {
        setShowTooltip(false)
        setTextResult("")
    }

    const handleExplainLike5 = (event) => {
        event.stopPropagation();
        setLoading(true)
        let data = JSON.stringify({
            "model": "mistral-7b-instruct",
            "messages": [
                {
                    "role": "system",
                    "content": "Be precise and concise."
                },
                {
                    "role": "user",
                    "content": `Help me understand by explaining like I am five: ${selection}. Keep it very brief. Use spacing and paragraph your content`
                }
            ]
        });

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: '/chat/completions',
            headers: {
                'accept': 'application/json',
                'authorization': `Bearer ${apiKey}`,
                'content-type': 'application/json',
            },
            data: data
        };
        axios.request(config)
            .then((response) => {
                setLoading(false)
                setTextResult(response.data.choices[0].message.content)
            })
            .catch((error) => {
                console.log(error);
            });
    };
    return (
        <div>
            <HtmlTooltip
                title={
                    <React.Fragment>
                        <div>
                            <Button color="inherit" onClick={handleOnlineLookup}>Search</Button>
                            <Button color="inherit" onClick={handleExplainLike5}>Eli5</Button>
                            <Button color="warning" onClick={handleEscape}>Esc</Button>

                        </div>
                        {loading? <LinearProgress />: null }
                        <p>{textResult}</p>
                    </React.Fragment>
                }
                arrow
                placement="top"
                open={showTooltip}
            >
                <Textarea
                    onPointerUp={handleTextSelect}
                    id="outlined-multiline-static"
                    label="Text"
                    disabled
                    minRows={4}
                    defaultValue={subjectText}
                />
            </HtmlTooltip>
        </div>
    );
}