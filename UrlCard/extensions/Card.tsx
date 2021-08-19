import * as React from "react";
import { Card, ICardTokens, ICardSectionStyles, ICardSectionTokens } from '@uifabric/react-cards';
import { FontWeights } from '@uifabric/styling';
import { Icon, IIconStyles, Image, Stack, IStackTokens, Text, ITextStyles } from 'office-ui-fabric-react';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { initializeIcons } from "office-ui-fabric-react/lib/Icons";
import * as moment from "moment";
import { Divider } from  "antd";
initializeIcons(undefined, { disableWarnings: true });

export interface ICardProps {
    isRequired?: boolean;
    errorMessage?: string;
    searchData?: Array<string>;

    triggerOnChange?: (event: any, newValue?: string) => void;
    triggerOnClick?: () => void;
}

export interface ICardState extends React.ComponentState {
}

export class CardHorizontalExample extends React.Component<ICardProps, ICardState> {

    constructor(props: ICardProps) {
        super(props);

        this.state = {
            isRequired: props.isRequired || false,
            errorMessage: props.errorMessage || "",
            searchData: props.searchData || [],

            onChange: props.triggerOnChange,
            onClick: props.triggerOnClick,
        };
    }

    public getVideoPath(videoPath: any) {
        const videoNameArray = videoPath.split('/');
        const videoNameSplit = videoNameArray[videoNameArray.length - 1].split('.');
        const videoName = videoNameSplit[0];
        return videoName;
    }

    public openVideo(videoPath: any) {
        console.log(videoPath)
    }

    public componentWillReceiveProps(newProps: ICardProps): void {
        this.setState(newProps);
    }

    public render(): JSX.Element {
        const siteTextStyles: ITextStyles = {
            root: {
                color: '#025F52',
                fontWeight: FontWeights.semibold,
            },
        };
        const descriptionTextStyles: ITextStyles = {
            root: {
                color: '#333333',
                fontWeight: FontWeights.regular,
            },
        };
        const helpfulTextStyles: ITextStyles = {
            root: {
                color: '#333333',
                fontWeight: FontWeights.regular,
            },
        };
        const iconStyles: IIconStyles = {
            root: {
                color: '#0078D4',
                fontSize: 16,
                fontWeight: FontWeights.regular,
            },
        };
        const footerCardSectionStyles: ICardSectionStyles = {
            root: {
                alignSelf: 'stretch',
                borderLeft: '1px solid #F3F2F1',
            },
        };

        const sectionStackTokens: IStackTokens = { childrenGap: 20 };
        const cardTokens: ICardTokens = { childrenMargin: 12 };
        const footerCardSectionTokens: ICardSectionTokens = { padding: '0px 0px 0px 12px' };
        const iconProps = { iconName: 'Globe' };

        return (
            <>
                <Stack tokens={sectionStackTokens} className="mainStack">
                    <TextField // prettier-ignore
                        label={this.state.label}
                        ariaLabel={this.state.label}
                        iconProps={iconProps}
                        required={this.state.isRequired}
                        errorMessage={this.state.errorMessage}
                        onChange={this.state.onChange}
                        defaultValue={this.state.url}
                    />
                    {(this.state.searchData && this.state.searchData.length === 0) ? <p>No Data Found.</p> : <p>{this.state.searchData.length} matches are found.</p>}
                    <Divider />
                    <Divider />
                    <Divider />
                    <Divider />
                    <Divider />
                    {
                        this.state.searchData && this.state.searchData.map((data: any) => {
                            return <Card aria-label="URL Card" horizontal onClick={this.state.onClick} tokens={cardTokens}>
                                <Card.Item fill className="imageCardItem">
                                    <a onClick={() => { window.open(data.path, "_blank") }}>
                                        <Image src={data.blob_metadata.thumbnail} alt="Image" className="imageItem" />
                                    </a>
                                </Card.Item>
                                <Card.Section>
                                    <Text variant="large" styles={siteTextStyles}>
                                        {this.getVideoPath(data.path)}
                                    </Text>
                                    <Text styles={descriptionTextStyles}>
                                        {moment.utc(data.blob_metadata.creation_date).local().format('DD-MMM-YYYY')}
                                    </Text>
                                    <Text variant="small" styles={helpfulTextStyles}>
                                        {this.state.domain}
                                    </Text>
                                </Card.Section>
                                <Card.Section styles={footerCardSectionStyles} tokens={footerCardSectionTokens}>
                                    <a href={data.path} rel="noopener noreferrer" target="_blank"><Icon iconName="NavigateExternalInline" /> </a>
                                </Card.Section>
                            </Card>
                        })
                    }
                  
                </Stack>
            </>
        );
    }
}