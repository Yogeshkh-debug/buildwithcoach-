# Training Programs Navigation Verification

The first phone-emulation check showed that closing the expanded mobile menu changed the page layout while the smooth program-section scroll was already in progress, leaving the section start above the viewport. The navigation helper now waits for the menu close reflow before issuing the scroll. The follow-up phone check confirmed that the Training Programs action remains on `/`, the menu closes, the homepage PDF section begins at the viewport start, all four cards remain accessible, and the page has no horizontal overflow.
