import React from 'react';

const LoadingScreen: React.FC = () => {
    return (
        <div className="p-4 min-w-[85vw]">

            <div className="flex flex-col justify-center items-center h-screen bg-[#FAF9F4]">
                <div
                    className="flex justify-center items-center border-8 border-gray-300 rounded-full p-8 animate-spin">
                    <img src="/Bake.png" alt="Loading..." className="w-24 h-24"/>
                </div>
                <div className="w-8 h-8 bg-blue-500 rounded-full mt-6 animate-bounce"></div>
            </div>
        </div>
            );
            };

            export default LoadingScreen;
