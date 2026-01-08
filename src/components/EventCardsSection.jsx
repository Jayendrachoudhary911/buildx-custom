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

      <Grid container spacing={4}>
        {events.map((event, index) => (
          <Grid item xs={12} md={6} key={index}>
            <Card
              sx={{
                height: "100%",
                borderRadius: 3,
                boxShadow: "0 12px 30px rgba(0,0,0,0.2)",
                transition: "transform 0.3s ease",
                "&:hover": {
                  transform: "translateY(-6px)",
                },
              }}
            >
              {/* Event Image */}
              <CardMedia
                component="img"
                height="220"
                image={event.image}
                alt={event.title}
              />

              {/* Content */}
              <CardContent>
                <Typography fontSize={18} fontWeight={600} mb={1}>
                  {event.title}
                </Typography>

                <Typography fontSize={14} opacity={0.75} lineHeight={1.7}>
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
