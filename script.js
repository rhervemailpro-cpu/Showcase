let chart = null;
let currentEventIndex = 0;

// Initialize chart on page load
document.addEventListener('DOMContentLoaded', function() {
    initChart();
    displayEventDetails(0);
});

function initChart() {
    const ctx = document.getElementById('runningChart').getContext('2d');
    
    // Sort data by year for chronological order
    const sortedData = [...runningData].sort((a, b) => a.year - b.year);
    
    // Prepare data for the chart
    const labels = sortedData.map(d => d.year);
    const distances = sortedData.map(d => d.distance);
    const positions = sortedData.map(d => d.position);
    
    chart = new Chart(ctx, {
        type: 'bubble',
        data: {
            datasets: [
                {
                    label: 'Running Performance',
                    data: sortedData.map(d => ({
                        x: d.year,
                        y: d.distance,
                        r: Math.max(20, 40 - d.position / 10) // Bubble size inverse to position
                    })),
                    backgroundColor: sortedData.map((d, i) => {
                        // Create gradient colors - Lithuanian flag inspired (red, yellow, green)
                        const colors = [
                            'rgba(211, 46, 46, 0.6)',    // Red
                            'rgba(255, 215, 0, 0.6)',    // Gold/Yellow
                            'rgba(34, 139, 34, 0.6)',    // Forest Green
                            'rgba(255, 165, 0, 0.6)',    // Orange
                            'rgba(205, 92, 92, 0.6)',    // Indian Red
                            'rgba(184, 134, 11, 0.6)',   // Dark Goldenrod
                            'rgba(46, 125, 50, 0.6)',    // Dark Green
                        ];
                        return colors[i % colors.length];
                    }),
                    borderColor: sortedData.map(() => 'rgba(211, 46, 46, 0.8)'),
                    borderWidth: 3,
                    hoverBorderWidth: 4,
                    hoverBorderColor: 'rgba(34, 139, 34, 1)',
                    hoverBackgroundColor: sortedData.map(() => 'rgba(211, 46, 46, 0.9)'),
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: true,
                    labels: {
                        color: 'rgba(211, 46, 46, 0.8)',
                        font: {
                            size: 14,
                            weight: 'bold',
                            family: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
                        },
                        padding: 20,
                        usePointStyle: true,
                        pointStyle: 'circle'
                    }
                },
                tooltip: {
                    enabled: true,
                    backgroundColor: 'rgba(211, 46, 46, 0.9)',
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                    borderWidth: 2,
                    padding: 12,
                    displayColors: false,
                    callbacks: {
                        title: function(context) {
                            const dataIndex = context[0].dataIndex;
                            return sortedData[dataIndex].event;
                        },
                        label: function(context) {
                            const dataIndex = context.dataIndex;
                            const data = sortedData[dataIndex];
                            return [
                                'Year: ' + data.year,
                                'Distance: ' + data.distance + ' km',
                                'Time: ' + data.time,
                                'Pace: ' + data.pace,
                                'Position: ' + data.position + '/' + data.totalParticipants
                            ];
                        }
                    }
                }
            },
            scales: {
                x: {
                    type: 'linear',
                    position: 'bottom',
                    min: 2012,
                    max: 2020,
                    ticks: {
                        stepSize: 1,
                        color: 'rgba(211, 46, 46, 0.7)',
                        font: {
                            size: 12,
                            weight: 'bold'
                        }
                    },
                    title: {
                        display: true,
                        text: 'Year',
                        color: 'rgba(211, 46, 46, 0.8)',
                        font: {
                            size: 14,
                            weight: 'bold'
                        }
                    },
                    grid: {
                        color: 'rgba(211, 46, 46, 0.2)',
                        drawBorder: false
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Distance (km)',
                        color: 'rgba(211, 46, 46, 0.8)',
                        font: {
                            size: 14,
                            weight: 'bold'
                        }
                    },
                    ticks: {
                        color: 'rgba(211, 46, 46, 0.7)',
                        font: {
                            size: 12,
                            weight: 'bold'
                        }
                    },
                    grid: {
                        color: 'rgba(211, 46, 46, 0.2)',
                        drawBorder: false
                    }
                }
            },
            onClick: (event, activeElements) => {
                if (activeElements.length > 0) {
                    const dataIndex = activeElements[0].index;
                    displayEventDetails(dataIndex, sortedData);
                }
            }
        }
    });
}

function displayEventDetails(index, data = null) {
    const sortedData = data || [...runningData].sort((a, b) => a.year - b.year);
    const event = sortedData[index];
    const detailsDiv = document.getElementById('eventDetails');
    
    // Calculate placement percentage
    const placementPercentage = ((event.position / event.totalParticipants) * 100).toFixed(1);
    
    detailsDiv.innerHTML = `
        <div style="animation: slideIn 0.5s ease-out;">
            <h3 style="color: #FF6B9D; font-size: 1.3rem; margin-bottom: 15px; text-transform: uppercase;">${event.event}</h3>
            
            <div class="detail-item">
                <div class="detail-label">📅 Year</div>
                <div class="detail-value">${event.year}</div>
            </div>
            
            <div class="detail-item">
                <div class="detail-label">📏 Distance</div>
                <div class="detail-value">${event.distance} km</div>
            </div>
            
            <div class="detail-item">
                <div class="detail-label">⏱️ Time</div>
                <div class="detail-value">${event.time}</div>
            </div>
            
            <div class="detail-item">
                <div class="detail-label">🏃 Pace</div>
                <div class="detail-value">${event.pace}</div>
            </div>
            
            <div class="detail-item">
                <div class="detail-label">🏅 Position</div>
                <div class="detail-value">${event.position} / ${event.totalParticipants}</div>
            </div>
            
            <div class="detail-item" style="background: linear-gradient(135deg, rgba(255, 182, 193, 0.6), rgba(230, 230, 250, 0.6)); border-left-color: #FFB6C1;">
                <div class="detail-label">📊 Placement</div>
                <div class="detail-value">${placementPercentage}% (Top ${(100 - placementPercentage).toFixed(1)}%)</div>
            </div>
        </div>
    `;
    
    currentEventIndex = index;
}

function openContact() {
    document.getElementById('contactModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeContact() {
    document.getElementById('contactModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Close modal when clicking outside of it
window.onclick = function(event) {
    const modal = document.getElementById('contactModal');
    if (event.target === modal) {
        closeContact();
    }
}

// Add smooth scroll behavior
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Keyboard navigation for events
document.addEventListener('keydown', function(event) {
    const sortedData = [...runningData].sort((a, b) => a.year - b.year);
    if (event.key === 'ArrowRight' && currentEventIndex < sortedData.length - 1) {
        displayEventDetails(currentEventIndex + 1, sortedData);
    } else if (event.key === 'ArrowLeft' && currentEventIndex > 0) {
        displayEventDetails(currentEventIndex - 1, sortedData);
    }
});
