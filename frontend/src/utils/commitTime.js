export const getCommitTime = (commitDates) => {
  const time = {
    Morning: 0,
    Day: 0,
    Evening: 0,
    Night: 0,
  };

  commitDates.forEach((dateTime) => {
    const hour = new Date(dateTime).getHours();

    if (hour >= 6 && hour < 12) time.Morning++;
    else if (hour >= 12 && hour < 18) time.Day++;
    else if (hour >= 18 && hour < 24) time.Evening++;
    else time.Night++;
  });

  return [
    { name: "Morning", value: time.Morning },
    { name: "Day", value: time.Day },
    { name: "Evening", value: time.Evening },
    { name: "Night", value: time.Night },
  ];
};
