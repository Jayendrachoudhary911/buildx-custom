import { Box, Grid, Typography, Card, CardMedia, CardContent } from "@mui/material";

export default function EventCardsSection() {
  const events = [
    {
      title: "BuildX CUSTOM — Design",
      description:
        "Focuses on research, UX thinking, and understanding real-world problems before building solutions.",
      image: "https://images.unsplash.com/photo-1559028012-481c04fa702d",
    },
    {
      title: "BuildX CUSTOM — Development",
      description:
        "A hands-on coding phase where teams build functional products under real-world constraints.",
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475",
    },
  ];

  return (
    <Box maxWidth={1100} mx="auto" px={3} py={10}>
      {/* Section Title */}
      <Typography
        variant="h5"
        mb={5}
        sx={{ fontWeight: 600, letterSpacing: "-0.02em" }}
      >
        The Events
      </Typography>

<Grid
  container
  spacing={{ xs: 2.5, sm: 3, md: 4 }}
  sx={{
    px: { xs: 1.5, sm: 2, md: 0 }, // outer spacing on mobile
  }}
>
  {events.map((event, index) => (
    <Grid item xs={12} md={6} key={index}>
      <Card
        sx={{
          height: "100%",
          borderRadius: 3,

          boxShadow: "0 12px 30px rgba(0,0,0,0.2)",

          transition: "all 0.3s ease",

          display: "flex",
          flexDirection: "column",

          "&:hover": {
            transform: "translateY(-6px)",
          },
        }}
      >
        {/* Event Image */}

        <CardMedia
          component="img"
          image={event.image}
          alt={event.title}
          sx={{
            height: { xs: 180, sm: 200, md: 220 },
            objectFit: "cover",
            borderTopLeftRadius: 12,
            borderTopRightRadius: 12,
          }}
        />

        {/* Content */}

        <CardContent
          sx={{
            flexGrow: 1,
            px: { xs: 2, sm: 2.5 },
            py: { xs: 2, sm: 2.5 },
          }}
        >
          <Typography
            fontSize={{ xs: 16, sm: 18 }}
            fontWeight={600}
            mb={1}
          >
            {event.title}
          </Typography>

          <Typography
            fontSize={{ xs: 13.5, sm: 14 }}
            opacity={0.75}
            lineHeight={1.7}
          >
            {event.description}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  ))}
</Grid>

    </Box>
  );
}
