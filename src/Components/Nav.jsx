import React from "react";
import {
  createStyles,
  Navbar,
  Button,
  Text,
  Flex,
  Stack,
  Paper,
  ScrollArea,
} from "@mantine/core";
import potholeIcon from "../images/pothole.png";

const useStyles = createStyles((theme) => ({
  nav: {
    borderRight: "1px solid gray",
    backgroundColor: "white",
  },

  navHeader: {
    borderBottom: "1px solid gray",
  },
  navFooter: {
    borderTop: "1px solid gray",
    // backgroundColor: "#F0BBDD",
  },
}));

const Nav = () => {
  const { classes } = useStyles();

  const potholeUpdates = [
    { id: 0, location: "x", time: "x" },
    { id: 1, location: "b", time: "c" },
    { id: 2, location: "f", time: "d" },
    { id: 3, location: "x", time: "x" },
    { id: 4, location: "b", time: "c" },
    { id: 5, location: "f", time: "d" },
    { id: 6, location: "x", time: "x" },
    { id: 7, location: "b", time: "c" },
    { id: 8, location: "f", time: "d" },
    { id: 9, location: "x", time: "x" },
    { id: 10, location: "b", time: "c" },
    { id: 11, location: "f", time: "d" },
    { id: 12, location: "f", time: "d" },
    { id: 13, location: "f", time: "d" },
    { id: 14, location: "f", time: "d" },
    { id: 15, location: "f", time: "d" },
  ];

  return (
    <Navbar
      width={{ sm: "15vw", lg: "20vw", base: 100 }}
      withBorder
      className={classes.nav}
    >
      <Navbar.Section className={classes.navHeader}>
        <Flex align="center" p="md" direction={{ base: "column", sm: "row" }}>
          <img src={potholeIcon} width={50} height={50} alt="header logo" />
          <Text
            fz={{ md: "md", lg: "lg", base: "xs" }}
            fw={700}
            sx={{ fontFamily: "Architects Daughter" }}
          >
            RepotHole
          </Text>
        </Flex>
      </Navbar.Section>
      <Navbar.Section grow mt="md" component={ScrollArea}>
        <Text
          fz={{ md: "md", lg: "lg", base: "xs" }}
          fw={700}
          pl={"xs"}
          pb={"xs"}
        >
          Live Updates
        </Text>
        <Stack justify="flex-start" spacing={{ base: "xs" }}>
          {potholeUpdates.map((item, index) => (
            <Paper shadow="xs" p="xl" withBorder key={index}>
              <Text>
                {item.id}, {item.location}, {item.time}
              </Text>
            </Paper>
          ))}
        </Stack>
      </Navbar.Section>
      <Navbar.Section className={classes.navFooter}>
        <Button color="blue" radius="xs" size="xl" fullWidth>
          <Text
            fz={{ md: "md", lg: "md", base: "xs" }}
            fw={400}
            pt={"xs"}
            pb={"xs"}
          >
            Admin Dashboard
          </Text>
        </Button>
      </Navbar.Section>
    </Navbar>
  );
};

export default Nav;
