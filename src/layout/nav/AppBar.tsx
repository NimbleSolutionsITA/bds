import Container from "@mui/material/Container";
import {AppBar as MuiAppBar, Button, IconButton} from "@mui/material";
import React, {useState} from "react";
import Box from "@mui/material/Box";
import logo from '../../images/bottega-di-sguardi-logo.png'
import Image from "next/image";
import {motion, Variants} from "framer-motion";
import {KeyboardArrowDown} from "@mui/icons-material";
import {MenuItem, Menus} from "../../types/settings";
import Link from "next/link";
import {sanitize} from "../../utils/utils";

type AppBarProps = {
    leftMenu: Menus['leftMenu'],
    rightMenu: Menus['rightMenu']
}

export default function AppBar({leftMenu, rightMenu}: AppBarProps) {
    return (
        <MuiAppBar
            position="sticky"
            elevation={0}
            sx={{
                height: '90px',
        }}
            color="secondary"
        >
            <Container sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%'}}>
                <Box
                    width="calc(50% - 70px)"
                    display="flex"
                    alignItems="center"
                    justifyContent="end"
                >
                    {leftMenu.map(item => <NavButton key={item.id} item={item} />)}
                </Box>
                <IconButton
                    component={Link}
                    href="/"
                    sx={{
                        marginX: '20px',
                        '&:hover': {
                            backgroundColor: 'inherit'
                        }
                    }}
                >
                    <Image
                        src={logo}
                        alt="Logo Bottega di Sguardi"
                        style={{ width: '80px', height: 'auto' }}
                    />
                </IconButton>
                <Box
                    width="calc(50% - 70px)"
                    display="flex"
                    alignItems="center"
                >
                    {rightMenu.map(item => <NavButton key={item.id} item={item} />)}
                </Box>
            </Container>
        </MuiAppBar>
    )
}

const itemVariants: Variants = {
    open: {
        opacity: 1,
        y: 0,
        transition: { type: "spring", stiffness: 300, damping: 24 }
    },
    closed: { opacity: 0, y: 20, transition: { duration: 0.2 } }
};
const NavButton = ({item}: {item: MenuItem}) => {
    const [isOpen, setIsOpen] = useState(false);
    const EndIcon = item.child_items  ? (
        <motion.div
            variants={{
                open: { rotate: 180 },
                closed: { rotate: 0 }
            }}
            transition={{ duration: 0.2 }}
            style={{ display: 'flex' }}
        >
            <KeyboardArrowDown fontSize="small" />
        </motion.div>
    ) : undefined



    return (
        <motion.div
            initial={false}
            animate={isOpen ? "open" : "closed"}
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
        >
            <motion.div
                whileTap={{ scale: 0.97 }}
            >
                <Button
                    variant="text"
                    size="small"
                    sx={{
                        color: 'black',
                        lineHeight: '1em',
                        '& .MuiButton-endIcon': {
                            marginLeft: 0
                        }
                    }}
                    endIcon={EndIcon}
                >
                    {item.title}
                </Button>
            </motion.div>
            {item.child_items && (
                <motion.div
                    variants={{
                        open: {
                            clipPath: "inset(0% 0% 0% 0%)",
                            transition: {
                                type: "spring",
                                bounce: 0,
                                duration: 0.7,
                                delayChildren: 0.3,
                                staggerChildren: 0.05
                            }
                        },
                        closed: {
                            clipPath: "inset(10% 50% 90% 50% round 10px)",
                            transition: {
                                type: "spring",
                                bounce: 0,
                                duration: 0.3
                            }
                        }
                    }}
                    style={{
                        pointerEvents: isOpen ? "auto" : "none",
                        position: 'absolute',
                        display: 'flex',
                        flexDirection: 'column',
                        backgroundColor: '#ffffff',
                        padding: '10px',
                        marginLeft: '-10px',
                        zIndex: 1101
                    }}
                >
                    {item.groups ? (
                        <GroupedItems items={item.child_items} groups={item.groups} />
                    ) : item.child_items.map(subItem => (
                        <SubItem key={subItem.id} subItem={subItem} />
                    ))}
                </motion.div>
            )}
        </motion.div>
    )
}

const GroupedItems = ({items, groups}: {items: MenuItem[], groups: string[]}) => (
    <div style={{display: 'flex'}}>
        {groups.map((group) => (
            <div key={group} style={{display: 'flex', flexDirection: 'column', marginRight: '20px'}}>
                <div style={{
                    fontSize: '14px',
                    fontWeight: 500,
                    marginBottom: '5px',
                    padding: '5px',
                    backgroundColor: 'rgba(0,0,0,0.1)'
                }}>{group}</div>
                {items.filter(item => item.parent === group).map(subItem => (
                    <SubItem key={subItem.id} subItem={subItem} />
                ))}
            </div>
        ))}
    </div>
)

const SubItem = ({subItem}: {subItem: MenuItem}) => (
    <motion.div variants={itemVariants} key={subItem.id}>
        <Button
            variant="text"
            size="small"
            sx={{
                color: 'black',
                minWidth: 0,
                fontWeight: 300,
                '& .MuiButton-endIcon': {
                    marginLeft: 0
                },
                '&:hover': {
                    fontWeight: 500
                }
            }}
        >
            <span dangerouslySetInnerHTML={{__html: sanitize(subItem.title)}}></span>
        </Button>
    </motion.div>
)