import streamlit as st
import yt_dlp
import os

# --- Configuration ---
DOWNLOAD_DIR = "downloads"

# Ensure download directory exists
if not os.path.exists(DOWNLOAD_DIR):
    os.makedirs(DOWNLOAD_DIR)

st.set_page_config(page_title="StreamSaver Debug", page_icon="⬇️")

st.title("⬇️ StreamSaver (Direct Mode)")
st.caption("Debug Version: No Caching, Direct Variable Access")

# --- UI Inputs (Direct Access) ---
# We use standard widgets instead of a form to ensure the variable 
# is strictly updated on every interaction/rerun.

url_input = st.text_input("Video URL", placeholder="https://www.youtube.com/watch?v=...")

col1, col2 = st.columns(2)
with col1:
    format_selection = st.selectbox("Format", ["MP4", "MP3"])
with col2:
    # Quality only matters for Video
    quality_selection = st.selectbox("Quality", ["Best", "1080p", "720p"], disabled=(format_selection == "MP3"))

# --- Download Logic ---
if st.button("Start Download"):
    # 1. IMMEDIATE DEBUG DISPLAY
    # This confirms exactly what string the script is seeing right now.
    st.warning(f"DEBUG: The tool is currently processing this URL: {url_input}")

    if not url_input.strip():
        st.error("Error: URL is empty.")
    else:
        # Define variable to track success state for the finally block
        download_success = False
        video_title = "Unknown"

        try:
            with st.spinner("Initializing download..."):
                
                # Configure Format options
                if format_selection == "MP3":
                    # Audio Only
                    ydl_format = 'bestaudio/best'
                    postprocessors = [{
                        'key': 'FFmpegExtractAudio',
                        'preferredcodec': 'mp3',
                        'preferredquality': '192',
                    }]
                    ext_config = {} # let yt-dlp handle mp3 extension via postprocessor
                else:
                    # Video (MP4)
                    postprocessors = []
                    if quality_selection == "1080p":
                        ydl_format = "bestvideo[height<=1080]+bestaudio/best[height<=1080]"
                    elif quality_selection == "720p":
                        ydl_format = "bestvideo[height<=720]+bestaudio/best[height<=720]"
                    else:
                        ydl_format = "bestvideo+bestaudio/best"
                    
                    # Force merge to MP4
                    ext_config = {'merge_output_format': 'mp4'}

                # Configure yt-dlp options
                ydl_opts = {
                    'noplaylist': True,  # CRITICAL: Ignore playlists, get single video
                    'outtmpl': f'{DOWNLOAD_DIR}/%(title)s.%(ext)s',
                    'format': ydl_format,
                    'postprocessors': postprocessors,
                    'quiet': True,
                    'no_warnings': True,
                    'restrictfilenames': True,
                }
                
                # Update with merge config if needed
                ydl_opts.update(ext_config)

                # Execute Download
                with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                    # Extract info first to get title
                    info = ydl.extract_info(url_input, download=True)
                    
                    # Handle edge case where noplaylist might still return a list structure
                    if 'entries' in info:
                        video_title = info['entries'][0]['title']
                    else:
                        video_title = info.get('title', 'Unknown Title')
                    
                    download_success = True

        except Exception as e:
            st.error(f"An error occurred: {str(e)}")
            
        finally:
            # clean up / final reporting
            if download_success:
                st.success(f"✅ Success! Downloaded: **{video_title}**")
                st.info(f"File saved to {os.path.abspath(DOWNLOAD_DIR)}")
            else:
                st.markdown("---")
                st.caption("Process finished (with errors).")
