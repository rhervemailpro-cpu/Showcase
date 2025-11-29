let chart = null;
let currentEventIndex = 0;

// Initialize chart on page load
document.addEventListener('DOMContentLoaded', function() {
    initChart();
    displayEventDetails(0);
    setupEventListeners();
    updatePanelBadge();
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
                        // Create modern gradient colors - Lithuanian flag inspired
                        const colors = [
                            'rgba(255, 107, 53, 0.7)',    // Modern Red/Orange
                            'rgba(255, 215, 0, 0.7)',     // Gold/Yellow
                            'rgba(34, 139, 34, 0.7)',     // Forest Green
                            'rgba(255, 140, 60, 0.7)',    // Light Orange
                            'rgba(220, 100, 90, 0.7)',    // Coral
                            'rgba(184, 134, 11, 0.7)',    // Dark Goldenrod
                            'rgba(46, 125, 50, 0.7)',     // Dark Green
                        ];
                        return colors[i % colors.length];
                    }),
                    borderColor: sortedData.map(() => 'rgba(255, 255, 255, 0.4)'),
                    borderWidth: 2.5,
                    hoverBorderWidth: 3.5,
                    hoverBorderColor: 'rgba(255, 255, 255, 0.9)',
                    hoverBackgroundColor: sortedData.map(() => 'rgba(255, 107, 53, 0.9)'),
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            animation: {
                duration: 750,
                easing: 'easeInOutQuart'
            },
            plugins: {
                legend: {
                    display: true,
                    labels: {
                        color: 'rgba(255, 255, 255, 0.85)',
                        font: {
                            size: 14,
                            weight: 'bold',
                            family: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
                        },
                        padding: 20,
                        usePointStyle: true,
                        pointStyle: 'circle',
                        generateLabels: function() {
                            return [{
                                text: 'Performance Analytics',
                                fillStyle: 'rgba(255, 215, 0, 0.8)',
                                hidden: false,
                                index: 0
                            }];
                        }
                    }
                },
                tooltip: {
                    enabled: true,
                    backgroundColor: 'rgba(20, 20, 40, 0.95)',
                    titleColor: 'rgba(255, 215, 0, 0.95)',
                    bodyColor: 'rgba(255, 255, 255, 0.9)',
                    borderColor: 'rgba(255, 215, 0, 0.5)',
                    borderWidth: 1.5,
                    padding: 15,
                    displayColors: false,
                    titleFont: {
                        size: 14,
                        weight: 'bold'
                    },
                    bodyFont: {
                        size: 12
                    },
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
                        color: 'rgba(255, 255, 255, 0.6)',
                        font: {
                            size: 12,
                            weight: 'bold'
                        }
                    },
                    title: {
                        display: true,
                        text: 'Year',
                        color: 'rgba(255, 255, 255, 0.8)',
                        font: {
                            size: 14,
                            weight: 'bold'
                        }
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.08)',
                        drawBorder: false
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Distance (km)',
                        color: 'rgba(255, 255, 255, 0.8)',
                        font: {
                            size: 14,
                            weight: 'bold'
                        }
                    },
                    ticks: {
                        color: 'rgba(255, 255, 255, 0.6)',
                        font: {
                            size: 12,
                            weight: 'bold'
                        }
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.08)',
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
            <div class="detail-item">
                <div class="detail-label">📅 Year</div>
                <div class="detail-value">${event.year}</div>
            </div>
            
            <div class="detail-item">
                <div class="detail-label">🏃 Event Name</div>
                <div class="detail-value">${event.event}</div>
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
                <div class="detail-label">🎯 Pace</div>
                <div class="detail-value">${event.pace}</div>
            </div>
            
            <div class="detail-item">
                <div class="detail-label">🏅 Placement</div>
                <div class="detail-value">${event.position} / ${event.totalParticipants}</div>
            </div>
            
            <div class="detail-item" style="background: rgba(255, 215, 0, 0.15); border-left-color: rgba(255, 215, 0, 0.8); margin-top: 15px;">
                <div class="detail-label">📊 Percentile</div>
                <div class="detail-value">Top ${(100 - placementPercentage).toFixed(1)}%</div>
            </div>
        </div>
    `;
    
    currentEventIndex = index;
    updatePanelBadge();
}

function updatePanelBadge() {
    const badge = document.querySelector('.panel-badge');
    if (badge) {
        const sortedData = [...runningData].sort((a, b) => a.year - b.year);
        badge.textContent = `Event ${currentEventIndex + 1} of ${sortedData.length}`;
    }
}

function setupEventListeners() {
    // Close modal when clicking outside
    document.addEventListener('click', function(event) {
        const modal = document.getElementById('contactModal');
        if (event.target === modal || event.target === modal?.querySelector('.modal-overlay')) {
            closeContact();
        }
    });

    // Close modal on escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closeContact();
        }
    });
}

function openContact() {
    const modal = document.getElementById('contactModal');
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    // Focus on first input
    setTimeout(() => {
        document.getElementById('name').focus();
    }, 100);
}

function closeContact() {
    document.getElementById('contactModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

function handleSubmit(event) {
    event.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    
    // Here you would typically send the data to a server
    console.log('Form submitted:', { name, email, message });
    
    // Show success message
    alert(`Thank you, ${name}! Your message has been sent.`);
    
    // Reset form and close modal
    event.target.reset();
    closeContact();
}

// Keyboard navigation for events
document.addEventListener('keydown', function(event) {
    const sortedData = [...runningData].sort((a, b) => a.year - b.year);
    if (event.key === 'ArrowRight' && currentEventIndex < sortedData.length - 1) {
        displayEventDetails(currentEventIndex + 1, sortedData);
    } else if (event.key === 'ArrowLeft' && currentEventIndex > 0) {
        displayEventDetails(currentEventIndex - 1, sortedData);
    }
});
